/**
 * Groups Processor Service
 */

const _ = require('lodash')
const Joi = require('@hapi/joi')
const config = require('config')
const logger = require('../common/logger')
const helper = require('../common/helper')

/**
 * Process add groups member message
 * @param {Object} message the kafka message
 */
async function processMemberAdd (message) {
  const { groupId, universalUID: userId, membershipType, name: groupName } = message.payload
  const propertyName = config.get('ES.USER_GROUP_PROPERTY_NAME')
  if (membershipType === config.get('GROUPS_MEMBERSHIP_TYPE')) {
    const user = await helper.getUser(userId)
    if (!user[propertyName]) {
      user[propertyName] = []
    }
    // check the group member does not exist
    if (_.some(user[propertyName], { groupId })) {
      logger.error(`Can't add existed group member with the groupId: ${groupId}, userId: ${userId}`)
      throw helper.getErrorWithStatus('[version_conflict_engine_exception]', 409)
    } else {
      user[propertyName].push({ groupId, groupName })
      await helper.updateUser(userId, user)
    }
  } else {
    logger.info(`Ignore this groups member add message since membershipType is not 'user'`)
  }
}

processMemberAdd.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      groupId: Joi.string().uuid().required(),
      universalUID: Joi.string().uuid().required(),
      membershipType: Joi.string().required(),
      name: Joi.string().required()
    }).required().unknown(true)
  }).required()
}

/**
 * Process remove groups member message
 * @param {Object} message the kafka message
 */
async function processMemberDelete (message) {
  const { groupId, universalUID: userId } = message.payload
  const propertyName = config.get('ES.USER_GROUP_PROPERTY_NAME')
  const user = await helper.getUser(userId)

  // check the group member exist
  if (!user[propertyName] || !_.some(user[propertyName], { groupId })) {
    logger.error(`The user: ${userId} not exist in group: ${groupId}`)
    throw helper.getErrorWithStatus('[resource_not_found_exception]', 404)
  } else {
    _.remove(user[propertyName], { groupId })
    await helper.updateUser(userId, user)
  }
}

processMemberDelete.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      groupId: Joi.string().uuid().required(),
      universalUID: Joi.string().uuid().required()
    }).required().unknown(true)
  }).required()
}
module.exports = {
  processMemberAdd,
  processMemberDelete
}

logger.buildService(module.exports)
