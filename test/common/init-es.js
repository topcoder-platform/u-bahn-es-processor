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

const config = require('config')
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
  for (const key in topResources) {
    const exists = await client.indices.exists({ index: topResources[key].index })
    if (exists.body) {
      logger.info(`The index ${topResources[key].index} exists.`)
    } else {
      logger.info(`The index ${topResources[key].index} will be created.`)
      await client.indices.create({
        index: topResources[key].index,
        body: {
          mappings: {
            properties: _(topResources[key].mappingFields).map(p => [p, { type: 'keyword' }]).fromPairs()
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
  }
  const processors = []
  for (const key in userResources) {
    logger.info(`The enrich policy ${key}-policy will be created.`)
    const top = topResources[userResources[key].relateTopResource]
    await client.enrich.putPolicy({
      name: top.enrichPolicy,
      body: {
        match: {
          indices: top.index,
          match_field: 'id',
          enrich_fields: top.mappingFields
        }
      }
    })
    await client.enrich.executePolicy({ name: top.enrichPolicy })
    processors.push({
      foreach: {
        field: userResources[key].propertyName,
        ignore_missing: true,
        processor: {
          enrich: {
            policy_name: top.enrichPolicy,
            ignore_missing: true,
            field: `_ingest._value.${userResources[key].relateKey}`,
            target_field: '_ingest._value'
          }
        }
      }
    })
  }

  logger.info(`The pipeline ${config.ES.ENRICH_USER_PIPELINE_NAME} will be created.`)
  await client.ingest.putPipeline({
    id: config.ES.ENRICH_USER_PIPELINE_NAME,
    body: {
      processors
    }
  })
}

/**
 * Delete elastic search index
 */
const clearES = async () => {
  try {
    logger.info(`Delete pipeline ${config.ES.ENRICH_USER_PIPELINE_NAME} if any.`)
    await client.ingest.deletePipeline({ id: config.ES.ENRICH_USER_PIPELINE_NAME })
  } catch (err) {
    // ignore
  }
  for (const key in userResources) {
    try {
      const policyName = topResources[userResources[key].relateTopResource].enrichPolicy
      logger.info(`Delete enrich policy ${policyName} if any.`)
      await client.enrich.deletePolicy({
        name: policyName
      })
    } catch (err) {
    // ignore
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
    logger.error(e)
    process.exit()
  })
}

module.exports = {
  init,
  clearES
}
