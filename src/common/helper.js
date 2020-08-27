/**
 * Contains generic helper methods
 */

const AWS = require('aws-sdk')
const config = require('config')
const elasticsearch = require('elasticsearch')
const _ = require('lodash')
const Joi = require('@hapi/joi')
const { Mutex } = require('async-mutex')

AWS.config.region = config.ES.AWS_REGION

// Elasticsearch client
let esClient

// Mutex to ensure that only one elasticsearch action is carried out at any given time
const esClientMutex = new Mutex()

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
 * Wraps original get es client function
 * to control access to elasticsearch using a mutex
 */
async function getESClientWrapper () {
  const client = await getESClient()
  const release = await esClientMutex.acquire()

  return { client, release }
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
 * @param {Boolean} isTransaction Is this part of a transaction?
 * @returns {Object} user
 */
async function getUser (userId, isTransaction = false) {
  const { client, release } = await getESClientWrapper()

  try {
    const user = await client.get({ index: config.get('ES.USER_INDEX'), type: config.get('ES.USER_TYPE'), id: userId })

    if (isTransaction) {
      return { seqNo: user._seq_no, primaryTerm: user._primary_term, user: user._source, release }
    }

    return { seqNo: user._seq_no, primaryTerm: user._primary_term, user: user._source }
  } finally {
    if (!isTransaction) {
      release()
    }
  }
}

/**
 * Function to update es user
 * @param {String} userId
 * @param {Number} seqNo
 * @param {Number} primaryTerm
 * @param {Object} body
 * @param {Boolean} isTransaction If this is part of a transaction, it will not attempt to release
 */
async function updateUser (userId, body, seqNo, primaryTerm, isTransaction = false) {
  let client, release

  if (isTransaction) {
    client = await getESClient()
  } else {
    const esClient = await getESClientWrapper()
    client = esClient.client
    release = esClient.release
  }

  try {
    await client.update({
      index: config.get('ES.USER_INDEX'),
      type: config.get('ES.USER_TYPE'),
      id: userId,
      body: { doc: body },
      if_seq_no: seqNo,
      if_primary_term: primaryTerm
    })
  } finally {
    if (!isTransaction) {
      release()
    }
  }
}

/**
 * Function to get org from es
 * @param {String} organizationId
 * @param {Boolean} isTransaction Is this part of a transaction?
 * @returns {Object} organization
 */
async function getOrg (organizationId, isTransaction = false) {
  const { client, release } = await getESClientWrapper()

  try {
    const org = await client.get({ index: config.get('ES.ORGANIZATION_INDEX'), type: config.get('ES.ORGANIZATION_TYPE'), id: organizationId })

    if (isTransaction) {
      return { seqNo: org._seq_no, primaryTerm: org._primary_term, org: org._source, release }
    }

    return { seqNo: org._seq_no, primaryTerm: org._primary_term, org: org._source }
  } finally {
    if (!isTransaction) {
      release()
    }
  }
}

/**
 * Function to update es organization
 * @param {String} organizationId
 * @param {Object} body
 * @param {Number} seqNo
 * @param {Number} primaryTerm
 * @param {Boolean} isTransaction If this is part of a transaction, it will not attempt to lock
 */
async function updateOrg (organizationId, body, seqNo, primaryTerm, isTransaction = false) {
  let client, release

  if (isTransaction) {
    client = await getESClient()
  } else {
    const esClient = await getESClientWrapper()
    client = esClient.client
    release = esClient.release
  }

  try {
    await client.update({
      index: config.get('ES.ORGANIZATION_INDEX'),
      type: config.get('ES.ORGANIZATION_TYPE'),
      id: organizationId,
      body: { doc: body },
      if_seq_no: seqNo,
      if_primary_term: primaryTerm
    })
  } finally {
    if (!isTransaction) {
      release()
    }
  }
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
  getESClientWrapper,
  validProperties,
  getUser,
  updateUser,
  getOrg,
  updateOrg,
  getErrorWithStatus
}
