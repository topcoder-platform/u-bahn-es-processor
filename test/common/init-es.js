/**
 * ! OBSOLETE SCRIPT. NOT MAINTAINED.
 * ! Use the one from ubahn-api instead
 * ! ( https://github.com/topcoder-platform/u-bahn-api )
 */

/**
 * Initialize elastic search.
 * It will create configured index in elastic search if it is not present.
 * It can delete and re-create index if providing an extra 'force' argument.
 * Usage:
 * node src/init-es
 * node src/init-es force
 */

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
    if (exists) {
      logger.info(`The index ${topResources[key].index} exists.`)
    } else {
      logger.info(`The index ${topResources[key].index} will be created.`)
      await client.indices.create({ index: topResources[key].index })

      if (needsNestedTypes.includes(topResources[key] === 'user')) {
        for (const childKey in userResources) {
          if (userResources[key].isNested) {
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
}

/**
 * Delete elastic search index
 */
const clearES = async () => {
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
