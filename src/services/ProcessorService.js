/**
 * Processor Service
 */

const _ = require('lodash')
const Joi = require('@hapi/joi')
const logger = require('../common/logger')
const helper = require('../common/helper')
const { topResources, userResources } = require('../common/constants')

/**
 * Process create entity message
 * @param {Object} message the kafka message
 */
async function processCreate (message) {
  const resource = message.payload.resource
  if (_.includes(_.keys(topResources), resource)) {
    // process the top resources such as user, skill...
    helper.validProperties(message.payload, ['id'])
    const client = await helper.getESClient()
    await client.create({
      index: topResources[resource].index,
      type: topResources[resource].type,
      id: message.payload.id,
      body: _.omit(message.payload, 'resource'),
      refresh: 'true'
    })
  } else if (_.includes(_.keys(userResources), resource)) {
    // process user resources such as userSkill, userAttribute...
    const userResource = userResources[resource]
    userResource.validate(message.payload)
    const user = await helper.getUser(message.payload.userId)
    const relateId = message.payload[userResource.relateKey]
    if (!user[userResource.propertyName]) {
      user[userResource.propertyName] = []
    }

    // check the resource does not exist
    if (_.some(user[userResource.propertyName], [userResource.relateKey, relateId])) {
      logger.error(`Can't create existed ${resource} with the ${userResource.relateKey}: ${relateId}, userId: ${message.payload.userId}`)
      throw helper.getErrorWithStatus('[version_conflict_engine_exception]', 409)
    } else {
      user[userResource.propertyName].push(_.omit(message.payload, 'resource'))
      await helper.updateUser(message.payload.userId, user)
    }
  } else {
    logger.info(`Ignore this message since resource is not in [${_.union(_.keys(topResources), _.keys(userResources))}]`)
  }
}

processCreate.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      resource: Joi.string().required()
    }).required().unknown(true)
  }).required()
}

/**
 * Process update entity message
 * @param {Object} message the kafka message
 */
async function processUpdate (message) {
  const resource = message.payload.resource
  if (_.includes(_.keys(topResources), resource)) {
    // process the top resources such as user, skill...
    helper.validProperties(message.payload, ['id'])
    const client = await helper.getESClient()
    const { index, type } = topResources[resource]
    const id = message.payload.id
    const source = await client.getSource({ index, type, id })
    await client.update({ index, type, id, body: { doc: _.assign(source, _.omit(message.payload, 'resource')) }, refresh: 'true' })
  } else if (_.includes(_.keys(userResources), resource)) {
    // process user resources such as userSkill, userAttribute...
    const userResource = userResources[resource]
    userResource.validate(message.payload)
    const user = await helper.getUser(message.payload.userId)
    const relateId = message.payload[userResource.relateKey]

    // check the resource exist
    if (!user[userResource.propertyName] || !_.some(user[userResource.propertyName], [userResource.relateKey, relateId])) {
      logger.error(`The ${resource} with the ${userResource.relateKey}: ${relateId}, userId: ${message.payload.userId} not exist`)
      throw helper.getErrorWithStatus('[resource_not_found_exception]', 404)
    } else {
      const updateIndex = _.findIndex(user[userResource.propertyName], [userResource.relateKey, relateId])
      user[userResource.propertyName].splice(updateIndex, 1, _.omit(message.payload, 'resource'))
      await helper.updateUser(message.payload.userId, user)
    }
  } else {
    logger.info(`Ignore this message since resource is not in [${_.union(_.keys(topResources), _.keys(userResources))}]`)
  }
}

processUpdate.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      resource: Joi.string().required()
    }).required().unknown(true)
  }).required()
}

/**
 * Process delete entity message
 * @param {Object} message the kafka message
 */
async function processDelete (message) {
  const resource = message.payload.resource
  if (_.includes(_.keys(topResources), resource)) {
    // process the top resources such as user, skill...
    helper.validProperties(message.payload, ['id'])
    const client = await helper.getESClient()
    await client.delete({
      index: topResources[resource].index,
      type: topResources[resource].type,
      id: message.payload.id,
      refresh: 'true'
    })
  } else if (_.includes(_.keys(userResources), resource)) {
    // process user resources such as userSkill, userAttribute...
    const userResource = userResources[resource]
    userResource.validate(message.payload)
    const user = await helper.getUser(message.payload.userId)
    const relateId = message.payload[userResource.relateKey]

    // check the resource exist
    if (!user[userResource.propertyName] || !_.some(user[userResource.propertyName], [userResource.relateKey, relateId])) {
      logger.error(`The ${resource} with the ${userResource.relateKey}: ${relateId}, userId: ${message.payload.userId} not exist`)
      throw helper.getErrorWithStatus('[resource_not_found_exception]', 404)
    } else {
      _.remove(user[userResource.propertyName], [userResource.relateKey, relateId])
      await helper.updateUser(message.payload.userId, user)
    }
  } else {
    logger.info(`Ignore this message since resource is not in [${_.union(_.keys(topResources), _.keys(userResources))}]`)
  }
}

processDelete.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      resource: Joi.string().required()
    }).required().unknown(true)
  }).required()
}

module.exports = {
  processCreate,
  processUpdate,
  processDelete
}

logger.buildService(module.exports)
