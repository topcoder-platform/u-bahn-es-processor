/**
 * Contains generic helper methods
 */

const AWS = require('aws-sdk')
const config = require('config')
const elasticsearch = require('@elastic/elasticsearch')
const _ = require('lodash')
const Joi = require('@hapi/joi')
const { Mutex } = require('async-mutex')
const axios = require('axios')
const logger = require('./logger')
const m2mAuth = require('tc-core-library-js').auth.m2m
const topcoderM2M = m2mAuth(_.pick(config, ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME', 'AUTH0_PROXY_SERVER_URL']))

AWS.config.region = config.ES.AWS_REGION

// Elasticsearch client
let esClient
let transactionId
// Mutex to ensure that only one elasticsearch action is carried out at any given time
const esClientMutex = new Mutex()
const mutexReleaseMap = {}

/* Function to get M2M token
 * (Topcoder APIs only)
 * @returns {Promise}
 */
async function getTopcoderM2Mtoken () {
  return topcoderM2M.getMachineToken(config.AUTH0_CLIENT_ID, config.AUTH0_CLIENT_SECRET)
}

/**
 * Returns the user in Topcoder identified by the email
 * @param {String} email The user email
 */
async function getUserGroup (memberId) {
  const url = config.TOPCODER_GROUP_API
  const token = await getTopcoderM2Mtoken()
  const params = { memberId, membershipType: 'user', page: 1 }

  logger.debug(`request GET ${url} with params: ${JSON.stringify(params)}`)
  let groups = []
  let groupRes = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, params })
  while (groupRes.data.length > 0) {
    groups = _.concat(groups, _.map(groupRes.data, g => _.pick(g, 'id', 'name')))
    params.page = params.page + 1
    groupRes = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, params })
  }
  return groups
}

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
  const cloudId = config.ES.ELASTICCLOUD.id

  if (cloudId) {
    // Elastic Cloud configuration
    esClient = new elasticsearch.Client({
      cloud: {
        id: cloudId
      },
      auth: {
        username: config.ES.ELASTICCLOUD.username,
        password: config.ES.ELASTICCLOUD.password
      }
    })
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
  try {
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
    logger.debug('Update user completed')
  } catch (err) {
    if (err && err.meta && err.meta.body && err.meta.body.error) {
      logger.debug(JSON.stringify(err.meta.body.error, null, 4))
    }
    logger.debug(JSON.stringify(err))
    throw err
  }
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
  getUserGroup,
  updateUser,
  getOrg,
  updateOrg,
  getErrorWithStatus,
  checkEsMutexRelease
}
