/**
 * Contains generic helper methods
 */
const _ = require('lodash')
const helper = require('../../src/common/helper')
const { topResources, userResources } = require('../../src/common/constants')

var client
(async function () {
  client = await helper.getESClient()
})()

/**
 * Get record from ES.
 * @param {Object} kafka message payload
 * @return {Object} the record entity
 */
async function getESRecord (payload) {
  if (topResources[payload.resource]) {
    return client.getSource({
      index: topResources[payload.resource].index,
      type: topResources[payload.resource].type,
      id: payload.id
    })
  } else {
    const userResource = userResources[payload.resource]
    const user = await helper.getUser(payload.userId)
    if (!user || !user[userResource.propertyName] || !_.some(user[userResource.propertyName], [userResource.relateKey, payload[userResource.relateKey]])) {
      const err = Error('[resource_not_found_exception]')
      err.statusCode = 404
      throw err
    }
    return _.find(user[userResource.propertyName], [userResource.relateKey, payload[userResource.relateKey]])
  }
}

module.exports = {
  getESRecord
}
