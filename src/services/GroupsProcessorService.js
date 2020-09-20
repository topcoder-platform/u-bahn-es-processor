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
 * @param {String} transactionId
 */
async function processMemberAdd (message, transactionId) {
  const { groupId, universalUID: userId, membershipType, name: groupName } = message.payload
  const propertyName = config.get('ES.USER_GROUP_PROPERTY_NAME')
  if (membershipType === config.get('GROUPS_MEMBERSHIP_TYPE')) {
    const { seqNo, primaryTerm, user } = await helper.getUser(userId, transactionId)
    if (!user[propertyName]) {
      user[propertyName] = []
    }
    // check the group member does not exist
    if (_.some(user[propertyName], { groupId })) {
      logger.error(`userId: ${userId} is already a member of group with the groupId ${groupId}`)
      throw helper.getErrorWithStatus('[version_conflict_engine_exception]', 409)
    } else {
      user[propertyName].push({ groupId, groupName })
      await helper.updateUser(userId, user, seqNo, primaryTerm, transactionId)
    }
  } else {
    logger.info(`Ignoring this groups member add message since membershipType is not 'user'`)
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
  }).required(),
  transactionId: Joi.string().required()
}

/**
 * Process remove groups member message
 * @param {Object} message the kafka message
 * @param {String} transactionId
 */
async function processMemberDelete (message, transactionId) {
  const { groupId, universalUID: userId } = message.payload
  const propertyName = config.get('ES.USER_GROUP_PROPERTY_NAME')
  const { seqNo, primaryTerm, user } = await helper.getUser(userId, transactionId)

  // check the group member exist
  if (!user[propertyName] || !_.some(user[propertyName], { groupId })) {
    logger.error(`The user: ${userId} not exist in group: ${groupId}`)
    throw helper.getErrorWithStatus('[resource_not_found_exception]', 404)
  } else {
    _.remove(user[propertyName], { groupId })
    await helper.updateUser(userId, user, seqNo, primaryTerm, transactionId)
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
  }).required(),
  transactionId: Joi.string().required()
}
module.exports = {
  processMemberAdd,
  processMemberDelete
}

logger.buildService(module.exports)
