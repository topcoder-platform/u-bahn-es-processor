/**
 * !OBSOLETE SCRIPT. Use the one from ubahn-api instead
 * !( https://github.com/topcoder-platform/u-bahn-api )
 */

/**
 * Initialize elastic search.
 * It will create configured index in elastic search if it is not present.
 * It can delete and re-create index if providing an extra 'force' argument.
 * Usage:
 * node src/init-es
 * node src/init-es force
 */

const _ = require('lodash')
const logger = require('../../src/common/logger')
const helper = require('../../src/common/helper')
const { topResources, userResources } = require('../../src/common/constants')

let client

let needsNestedTypes = ['user']

/**
 * Initialize elastic search index
 * @param {Boolean} isForce boolean flag indicate it is forced operation
 */
const init = async (isForce) => {
  if (!client) {
    client = await helper.getESClient()
  }
  if (isForce) {
    await clearES()
  }
  const processors = {}
  for (const key in topResources) {
    const exists = await client.indices.exists({ index: topResources[key].index })
    const top = topResources[key]
    if (exists.body) {
      logger.info(`The index ${top.index} exists.`)
    } else {
      logger.info(`The index ${top.index} will be created.`)
      await client.indices.create({
        index: top.index,
        body: {
          mappings: {
            properties: _(_.get(top, 'enrich.enrichFields', [])).map(p => [p, { type: 'keyword' }]).fromPairs()
          }
        }
      })
      if (needsNestedTypes.includes(key)) {
        for (const childKey in userResources) {
          if (userResources[childKey].isNested) {
            await client.indices.putMapping({
              index: topResources[key].index,
              type: topResources[key].type,
              include_type_name: true,
              body: {
                properties: {
                  [userResources[childKey].propertyName]: {
                    type: 'nested'
                  }
                }
              }
            })
          }
        }
      }
    }
    if (top['enrich']) {
      logger.info(`The enrich policy ${top.enrich.policyName} will be created.`)
      await client.enrich.putPolicy({
        name: top.enrich.policyName,
        body: {
          match: {
            indices: top.index,
            match_field: 'id',
            enrich_fields: top.enrich.enrichFields
          }
        }
      })
      await client.enrich.executePolicy({ name: top.enrich.policyName })
    }
    if (top['ingest']) {
      _.each(top.ingest.pipeline.processors, processor => {
        if (!processors[top.ingest.pipeline.id]) {
          processors[top.ingest.pipeline.id] = []
        }
        if (processor.isArray) {
          processors[top.ingest.pipeline.id].push({
            foreach: {
              field: processor.targetField,
              ignore_missing: true,
              processor: {
                enrich: {
                  policy_name: processor.policyName,
                  ignore_missing: true,
                  field: `_ingest._value.${processor.field}`,
                  target_field: '_ingest._value'
                }
              }
            }
          })
        } else {
          processors[top.ingest.pipeline.id].push({
            enrich: {
              policy_name: processor.policyName,
              ignore_missing: true,
              field: processor.field,
              target_field: processor.targetField
            }
          })
        }
      })
    }
  }

  for (const key in processors) {
    logger.info(`The pipeline ${key} will be created.`)
    await client.ingest.putPipeline({
      id: key,
      body: {
        processors: processors[key]
      }
    })
  }
}

/**
 * Delete elastic search index
 */
const clearES = async () => {
  for (const key in topResources) {
    if (topResources[key].ingest) {
      try {
        logger.info(`Delete pipeline ${topResources[key].ingest.pipeline.id} if any.`)
        await client.ingest.deletePipeline({ id: topResources[key].ingest.pipeline.id })
      } catch (err) {
        // ignore
      }
    }
  }
  for (const key in topResources) {
    if (topResources[key].enrich) {
      try {
        const policyName = topResources[key].enrich.policyName
        logger.info(`Delete enrich policy ${policyName} if any.`)
        await client.enrich.deletePolicy({
          name: policyName
        })
      } catch (err) {
      // ignore
      }
    }
  }
  for (const key in topResources) {
    logger.info(`Delete index ${topResources[key].index} if any.`)
    try {
      await client.indices.delete({ index: topResources[key].index })
    } catch (err) {
    // ignore
    }
  }
}

if (!module.parent) {
  const isForce = process.argv.length === 3 && process.argv[2] === 'force'

  init(isForce).then(() => {
    logger.info('done')
    process.exit()
  }).catch((e) => {
    logger.logFullError(e)
    process.exit()
  })
}

module.exports = {
  init,
  clearES
}
