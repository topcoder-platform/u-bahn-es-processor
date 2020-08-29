/**
 * The application entry point
 */

global.Promise = require('bluebird')
const config = require('config')
const Kafka = require('no-kafka')
const healthcheck = require('topcoder-healthcheck-dropin')
const logger = require('./common/logger')
const helper = require('./common/helper')
const ProcessorService = require('./services/ProcessorService')
const Mutex = require('async-mutex').Mutex

// Start kafka consumer
logger.info('Starting kafka consumer')
// create consumer
const consumer = new Kafka.GroupConsumer(helper.getKafkaOptions())

let mutex = new Mutex()

/*
 * Data handler linked with Kafka consumer
 * Whenever a new message is received by Kafka consumer,
 * this function will be invoked
 */
const dataHandler = (messageSet, topic, partition) => Promise.each(messageSet, async (m) => {
  const release = await mutex.acquire()
  const message = m.message.value.toString('utf8')
  logger.info(`Handle Kafka event message; Topic: ${topic}; Partition: ${partition}; Offset: ${
    m.offset}; Message: ${message}.`)
  let messageJSON

  try {
    messageJSON = JSON.parse(message)
  } catch (e) {
    logger.error('Invalid message JSON.')
    logger.logFullError(e)

    // commit the message and ignore it
    await consumer.commitOffset({ topic, partition, offset: m.offset })
    return
  } finally {
    release()
  }

  if (messageJSON.topic !== topic) {
    logger.error(`The message topic ${messageJSON.topic} doesn't match the Kafka topic ${topic}.`)

    // commit the message and ignore it
    await consumer.commitOffset({ topic, partition, offset: m.offset })
    release()
    return
  }

  try {
    switch (messageJSON.payload.originalTopic) {
      case config.UBAHN_CREATE_TOPIC:
        await ProcessorService.processCreate(messageJSON)
        break
      case config.UBAHN_UPDATE_TOPIC:
        await ProcessorService.processUpdate(messageJSON)
        break
      case config.UBAHN_DELETE_TOPIC:
        await ProcessorService.processDelete(messageJSON)
        break
      default:
        throw new Error(`Unknown original topic: ${messageJSON.payload.originalTopic}`)
    }

    logger.debug('Successfully processed message')
  } catch (err) {
    logger.logFullError(err)
  } finally {
    // Commit offset regardless of error
    await consumer.commitOffset({ topic, partition, offset: m.offset })
    release()
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

// const topics = [config.UBAHN_CREATE_TOPIC, config.UBAHN_UPDATE_TOPIC, config.UBAHN_DELETE_TOPIC]
const topics = [config.UBAHN_AGGREGATE_TOPIC]

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
