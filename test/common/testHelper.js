/**
 * Contains generic helper methods
 */
const _ = require('lodash')
const helper = require('../../src/common/helper')
const { topResources, userResources, organizationResources } = require('../../src/common/constants')

/**
 * Get record from ES.
 * @param {Object} kafka message payload
 * @return {Object} the record entity
 */
async function getESRecord (payload) {
  const { client, release } = await helper.getESClientWrapper()
  if (topResources[payload.resource]) {
    try {
      return client.getSource({
        index: topResources[payload.resource].index,
        type: topResources[payload.resource].type,
        id: payload.id
      })
    } finally {
      release()
    }
  } else if (organizationResources[payload.resource]) {
    const orgResource = organizationResources[payload.resource]
    const { org } = await helper.getOrg(payload.organizationId)
    if (!org || !org[orgResource.propertyName] || !_.some(org[orgResource.propertyName], [orgResource.relateKey, payload[orgResource.relateKey]])) {
      const err = Error('[resource_not_found_exception]')
      err.statusCode = 404
      throw err
    }
    return _.find(org[orgResource.propertyName], [orgResource.relateKey, payload[orgResource.relateKey]])
  } else {
    const userResource = userResources[payload.resource]
    const { user } = await helper.getUser(payload.userId)
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
