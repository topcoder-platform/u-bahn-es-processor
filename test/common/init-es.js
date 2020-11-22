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
const logger = require('../../src/common/logger')
const helper = require('../../src/common/helper')
const { topResources } = require('../../src/common/constants')

let client

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

module.exports = {
  checkEmpty,
  clearData
}
