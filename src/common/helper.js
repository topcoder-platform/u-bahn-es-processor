/**
 * Contains generic helper methods
 */

const AWS = require('aws-sdk')
const config = require('config')
const elasticsearch = require('elasticsearch')
const _ = require('lodash')
const Joi = require('@hapi/joi')

AWS.config.region = config.ES.AWS_REGION

// Elasticsearch client
let esClient

/**
 * Get Kafka options
 * @return {Object} the Kafka options
 */
function getKafkaOptions () {
  const options = { connectionString: config.KAFKA_URL, groupId: config.KAFKA_GROUP_ID }
  if (config.KAFKA_CLIENT_CERT && config.KAFKA_CLIENT_CERT_KEY) {
    options.ssl = { cert: config.KAFKA_CLIENT_CERT, key: config.KAFKA_CLIENT_CERT_KEY }
  }
  return options
}

/**
 * Get ES Client
 * @return {Object} Elasticsearch Client Instance
 */
async function getESClient () {
  if (esClient) {
    return esClient
  }
  const host = config.ES.HOST
  const apiVersion = config.ES.API_VERSION

  // AWS ES configuration is different from other providers
  if (/.*amazonaws.*/.test(host)) {
    try {
      esClient = new elasticsearch.Client({
        apiVersion,
        host,
        connectionClass: require('http-aws-es') // eslint-disable-line global-require
      })
    } catch (error) { console.log(error) }
  } else {
    esClient = new elasticsearch.Client({
      apiVersion,
      host
    })
  }
  return esClient
}

/**
 * Function to valid require keys
 * @param {Object} payload validated object
 * @param {Array} keys required keys
 * @throws {Error} if required key absent
 */
function validProperties (payload, keys) {
  const schema = Joi.object(_.fromPairs(_.map(keys, key => [key, Joi.string().uuid().required()]))).unknown(true)
  const error = schema.validate(payload).error
  if (error) {
    throw error
  }
}

/**
 * Function to get user from es
 * @param {String} userId
 * @param {Boolean} sourceOnly
 * @returns {Object} user
 */
async function getUser (userId, sourceOnly = true) {
  const client = await getESClient()

  if (sourceOnly) {
    return client.getSource({ index: config.get('ES.USER_INDEX'), type: config.get('ES.USER_TYPE'), id: userId })
  }

  return client.get({ index: config.get('ES.USER_INDEX'), type: config.get('ES.USER_TYPE'), id: userId })
}

/**
 * Function to update es user
 * @param {String} userId
 * @param {Number} seqNo
 * @param {Number} primaryTerm
 * @param {Object} body
 */
async function updateUser (userId, body, seqNo, primaryTerm) {
  const client = await getESClient()
  await client.update({
    index: config.get('ES.USER_INDEX'),
    type: config.get('ES.USER_TYPE'),
    id: userId,
    body: { doc: body },
    if_seq_no: seqNo,
    if_primary_term: primaryTerm
  })
}

/**
 * Function to get org from es
 * @param {String} organizationId
 * @returns {Object} organization
 */
async function getOrg (organizationId) {
  const client = await getESClient()
  return client.getSource({ index: config.get('ES.ORGANIZATION_INDEX'), type: config.get('ES.ORGANIZATION_TYPE'), id: organizationId })
}

/**
 * Function to update es organization
 * @param {String} organizationId
 * @param {Object} body
 */
async function updateOrg (organizationId, body) {
  const client = await getESClient()
  await client.update({
    index: config.get('ES.ORGANIZATION_INDEX'),
    type: config.get('ES.ORGANIZATION_TYPE'),
    id: organizationId,
    body: { doc: body },
    refresh: 'true'
  })
}

/**
 * Fuction to get an Error with statusCode property
 * @param {String} message error message
 * @param {Number} statusCode
 * @returns {Error} an Error with statusCode property
 */
function getErrorWithStatus (message, statusCode) {
  const error = Error(message)
  error.statusCode = statusCode
  return error
}

module.exports = {
  getKafkaOptions,
  getESClient,
  validProperties,
  getUser,
  updateUser,
  getOrg,
  updateOrg,
  getErrorWithStatus
}
