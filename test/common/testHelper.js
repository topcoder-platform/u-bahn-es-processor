/**
 * Contains generic helper methods
 */
const _ = require('lodash')
const config = require('config')
const helper = require('../../src/common/helper')
const { topResources, userResources, organizationResources } = require('../../src/common/constants')

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
    const ret = await client.getSource({
      index: topResources[payload.resource].index,
      type: topResources[payload.resource].type,
      id: payload.id
    })
    return ret.body
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

/**
 * Get user groups record from ES.
 * @param {string} userId the user id
 * @param {string} groupId the group id
 */
async function getESGroupRecord (userId, groupId) {
  const propertyName = config.get('ES.USER_GROUP_PROPERTY_NAME')
  const { user } = await helper.getUser(userId)
  if (!user || !user[propertyName] || !_.some(user[propertyName], { id: groupId })) {
    const err = Error('[resource_not_found_exception]')
    err.statusCode = 404
    throw err
  }
  return _.find(user[propertyName], { id: groupId })
}

function getExpectValue (payload, relationRecord) {
  const result = _.omit(payload, ['resource', 'originalTopic'])
  if (topResources[payload.resource] && topResources[payload.resource].ingest) {
    _.each(topResources[payload.resource].ingest.pipeline.processors, p => {
      const relationResource = _.keys(_.pickBy(topResources, value => value.enrich && value.enrich.policyName === p.policyName))[0]
      if (relationResource) {
        const record = _.find(relationRecord, r => r.payload.resource === relationResource && payload[p.field] === r.payload.id)
        if (record) {
          result[p.targetField] = _.pick(record.payload, topResources[relationResource].enrich.enrichFields)
        }
      }
    })
  }
  return result
}

module.exports = {
  getESRecord,
  getESGroupRecord,
  getExpectValue
}
