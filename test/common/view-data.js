/**
 * This is used to view Elasticsearch data of given id
 * Usage:
 * node test/view-data <resource-name> {elasticsearch-id}
 */
const _ = require('lodash')
const logger = require('../../src/common/logger')
const helper = require('../../src/common/helper')
const { topResources } = require('../../src/common/constants')

let client

if (process.argv.length < 4) {
  logger.error('Missing argument for Resource and Elasticsearch id.')
  process.exit()
}

const view = async (resource, id) => {
  if (!client) {
    client = await helper.getESClient()
  }
  if (_.includes(_.keys(topResources), resource)) {
    const ret = await client.getSource({ index: topResources[resource].index, type: topResources[resource].type, id })
    logger.info('Elasticsearch data:')
    logger.info(JSON.stringify(ret.body, null, 4))
  } else {
    logger.warn(`resource is invalid, it should in [${_.keys(topResources)}]`)
  }
}

view(process.argv[2], process.argv[3]).then(() => {
  process.exit()
}).catch((e) => {
  if (e.statusCode === 404) {
    logger.info('The data is not found.')
  } else {
    logger.error(e)
  }
  process.exit()
})
