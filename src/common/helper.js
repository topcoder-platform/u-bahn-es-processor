/**
 * Contains generic helper methods
 */

const AWS = require('aws-sdk')
const config = require('config')
const elasticsearch = require('@elastic/elasticsearch')
const createAwsElasticsearchConnector = require('aws-elasticsearch-connector')
const _ = require('lodash')
const Joi = require('@hapi/joi')
const { Mutex } = require('async-mutex')

AWS.config.region = config.ES.AWS_REGION

// Elasticsearch client
let esClient
let transactionId
// Mutex to ensure that only one elasticsearch action is carried out at any given time
const esClientMutex = new Mutex()
const mutexReleaseMap = {}

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

  // AWS ES configuration is different from other providers
  if (/.*amazonaws.*/.test(host)) {
    try {
      esClient = new elasticsearch.Client({
        ...createAwsElasticsearchConnector(AWS.config),
        node: host
      })
    } catch (error) { console.log(error) }
  } else {
    esClient = new elasticsearch.Client({
      node: host
    })
  }

  // Patch the transport to enable mutex
  esClient.transport.originalRequest = esClient.transport.request
  esClient.transport.request = async (params) => {
    const tId = _.get(params.querystring, 'transactionId')
    params.querystring = _.omit(params.querystring, 'transactionId')
    if (!tId || tId !== transactionId) {
      const release = await esClientMutex.acquire()
      mutexReleaseMap[tId || 'noTransaction'] = release
      transactionId = tId
    }
    try {
      return await esClient.transport.originalRequest(params)
    } finally {
      if (params.method !== 'GET' || !tId) {
        const release = mutexReleaseMap[tId || 'noTransaction']
        delete mutexReleaseMap[tId || 'noTransaction']
        transactionId = undefined
        if (release) {
          release()
        }
      }
    }
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
 * @param {String} transactionId
 * @returns {Object} user
 */
async function getUser (userId, transactionId) {
  const client = await getESClient()
  const { body: user } = await client.get({ index: config.get('ES.USER_INDEX'), type: config.get('ES.USER_TYPE'), id: userId, transactionId })
  return { seqNo: user._seq_no, primaryTerm: user._primary_term, user: user._source }
}

/**
 * Function to update es user
 * @param {String} userId
 * @param {Number} seqNo
 * @param {Number} primaryTerm
 * @param {String} transactionId
 * @param {Object} body
 */
async function updateUser (userId, body, seqNo, primaryTerm, transactionId) {
  const client = await getESClient()
  await client.index({
    index: config.get('ES.USER_INDEX'),
    type: config.get('ES.USER_TYPE'),
    id: userId,
    transactionId,
    body,
    if_seq_no: seqNo,
    if_primary_term: primaryTerm,
    pipeline: config.get('ES.ENRICHMENT.user.pipelineId'),
    refresh: 'wait_for'
  })
}

/**
 * Function to get org from es
 * @param {String} organizationId
 * @param {String} transactionId
 * @returns {Object} organization
 */
async function getOrg (organizationId, transactionId) {
  const client = await getESClient()
  const { body: org } = await client.get({ index: config.get('ES.ORGANIZATION_INDEX'), type: config.get('ES.ORGANIZATION_TYPE'), id: organizationId, transactionId })
  return { seqNo: org._seq_no, primaryTerm: org._primary_term, org: org._source }
}

/**
 * Function to update es organization
 * @param {String} organizationId
 * @param {Number} seqNo
 * @param {Number} primaryTerm
 * @param {String} transactionId
 * @param {Object} body
 */
async function updateOrg (organizationId, body, seqNo, primaryTerm, transactionId) {
  const client = await getESClient()
  await client.index({
    index: config.get('ES.ORGANIZATION_INDEX'),
    type: config.get('ES.ORGANIZATION_TYPE'),
    id: organizationId,
    transactionId,
    body,
    if_seq_no: seqNo,
    if_primary_term: primaryTerm,
    refresh: 'wait_for'
  })
  await client.enrich.executePolicy({ name: config.get('ES.ENRICHMENT.organization.enrichPolicyName') })
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

/**
 * Ensure the esClient mutex is released
 * @param {String} tId transactionId
 */
function checkEsMutexRelease (tId) {
  if (tId === transactionId) {
    const release = mutexReleaseMap[tId]
    delete mutexReleaseMap[tId]
    transactionId = undefined
    if (release) {
      release()
    }
  }
}

module.exports = {
  getKafkaOptions,
  getESClient,
  validProperties,
  getUser,
  updateUser,
  getOrg,
  updateOrg,
  getErrorWithStatus,
  checkEsMutexRelease
}
