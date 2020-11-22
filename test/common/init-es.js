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
const enrichedFields = ['attributegroup', 'skillprovider']

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
            properties: _(_.get(top, 'enrich.enrichFields', [])).map(p => [p, { type: _.includes(enrichedFields, p) ? 'nested' : 'keyword' }]).fromPairs()
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
            match_field: top.enrich.matchField,
            enrich_fields: top.enrich.enrichFields
          }
        }
      })
      await client.enrich.executePolicy({ name: top.enrich.policyName })
    }
    if (top.pipeline) {
      if (top.pipeline.processors) {
        processors[top.pipeline.id] = []
        _.each(top.pipeline.processors, processor => {
          processors[top.pipeline.id].push({
            foreach: {
              field: processor.referenceField,
              ignore_missing: true,
              processor: {
                enrich: {
                  policy_name: processor.enrichPolicyName,
                  ignore_missing: true,
                  field: processor.field,
                  target_field: processor.targetField,
                  max_matches: processor.maxMatches
                }
              }
            }
          })
        })
      } else {
        processors[top.pipeline.id] = [{
          enrich: {
            policy_name: top.enrich.policyName,
            ignore_missing: true,
            field: top.pipeline.field,
            target_field: top.pipeline.targetField,
            max_matches: top.pipeline.maxMatches
          }
        }]
      }
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
    if (topResources[key].pipeline) {
      try {
        logger.info(`Delete pipeline ${topResources[key].pipeline.id} if any.`)
        await client.ingest.deletePipeline({ id: topResources[key].pipeline.id })
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

/**
 * Check if elastic search is empty
 */
const checkEmpty = async () => {
  if (!client) {
    client = await helper.getESClient()
  }
  for (const key in topResources) {
    try {
      const { body } = await client.search({ index: topResources[key].index })
      if (body.hits.total.value > 0) {
        return false
      }
    } catch (err) {
    // ignore
    }
  }
  return true
}

/**
 * Clear elastic search data
 */
const clearData = async () => {
  if (!client) {
    client = await helper.getESClient()
  }
  for (const key in topResources) {
    logger.info(`Clear index ${topResources[key].index} data if any.`)
    try {
      await client.deleteByQuery({ index: topResources[key].index, body: { query: { match_all: {} } } })
    } catch (err) {
    // ignore
      logger.logFullError(err)
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
  clearES,
  checkEmpty,
  clearData
}
