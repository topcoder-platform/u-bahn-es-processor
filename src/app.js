/**
 * The application entry point
 */

global.Promise = require('bluebird')
const config = require('config')
const Kafka = require('no-kafka')
const _ = require('lodash')
const healthcheck = require('topcoder-healthcheck-dropin')
const logger = require('./common/logger')
const helper = require('./common/helper')
const ProcessorService = require('./services/ProcessorService')
const Mutex = require('async-mutex').Mutex

// Start kafka consumer
logger.info('Starting kafka consumer')
// create consumer
const consumer = new Kafka.GroupConsumer(helper.getKafkaOptions())

let count = 0
let mutex = new Mutex()

async function getLatestCount () {
  const release = await mutex.acquire()

  try {
    count = count + 1

    return count
  } finally {
    release()
  }
}

/*
 * Data handler linked with Kafka consumer
 * Whenever a new message is received by Kafka consumer,
 * this function will be invoked
 */
const dataHandler = (messageSet, topic, partition) => Promise.each(messageSet, async (m) => {
  const message = m.message.value.toString('utf8')
  logger.info(`Handle Kafka event message; Topic: ${topic}; Partition: ${partition}; Offset: ${
    m.offset}; Message: ${message}.`)
  let messageJSON
  let messageCount = await getLatestCount()

  logger.debug(`Current message count: ${messageCount}`)
  try {
    messageJSON = JSON.parse(message)
  } catch (e) {
    logger.error('Invalid message JSON.')
    logger.logFullError(e)

    logger.debug(`Commiting offset after processing message with count ${messageCount}`)

    // commit the message and ignore it
    await consumer.commitOffset({ topic, partition, offset: m.offset })
    return
  }

  if (messageJSON.topic !== topic) {
    logger.error(`The message topic ${messageJSON.topic} doesn't match the Kafka topic ${topic}.`)

    logger.debug(`Commiting offset after processing message with count ${messageCount}`)

    // commit the message and ignore it
    await consumer.commitOffset({ topic, partition, offset: m.offset })
    return
  }
  const transactionId = _.uniqueId('transaction_')
  try {
    switch (topic) {
      case config.UBAHN_CREATE_TOPIC:
        await ProcessorService.processCreate(messageJSON, transactionId)
        break
      case config.UBAHN_UPDATE_TOPIC:
        await ProcessorService.processUpdate(messageJSON, transactionId)
        break
      case config.UBAHN_DELETE_TOPIC:
        await ProcessorService.processDelete(messageJSON, transactionId)
        break
    }

    logger.debug(`Successfully processed message with count ${messageCount}`)
  } catch (err) {
    logger.logFullError(err)
  } finally {
    helper.checkEsMutexRelease(transactionId)
    logger.debug(`Commiting offset after processing message with count ${messageCount}`)

    // Commit offset regardless of error
    await consumer.commitOffset({ topic, partition, offset: m.offset })
  }
})

// check if there is kafka connection alive
const check = () => {
  if (!consumer.client.initialBrokers && !consumer.client.initialBrokers.length) {
    return false
  }
  let connected = true
  consumer.client.initialBrokers.forEach(conn => {
    logger.debug(`url ${conn.server()} - connected=${conn.connected}`)
    connected = conn.connected & connected
  })
  return connected
}

const topics = [config.UBAHN_CREATE_TOPIC, config.UBAHN_UPDATE_TOPIC, config.UBAHN_DELETE_TOPIC]

consumer
  .init([{
    subscriptions: topics,
    handler: dataHandler
  }])
  .then(() => {
    logger.info('Initialized.......')
    healthcheck.init([check])
    logger.info(topics)
    logger.info('Kick Start.......')
  })

if (process.env.NODE_ENV === 'test') {
  module.exports = consumer
}
