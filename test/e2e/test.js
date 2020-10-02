/**
 * E2E test of the UBahn ES Processor.
 */
global.Promise = require('bluebird')
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const config = require('config')
const helper = require('../../src/common/helper')
const { topResources, userResources, organizationResources } = require('../../src/common/constants')
const request = require('superagent')
const Kafka = require('no-kafka')
const should = require('should')
const logger = require('../../src/common/logger')
const { fields, testTopics, groupsTopics } = require('../common/testData')
const { init, clearES } = require('../common/init-es')
const { getESRecord, getESGroupRecord } = require('../common/testHelper')

describe('UBahn - Elasticsearch Data Processor E2E Test', () => {
  let app
  let infoLogs = []
  let errorLogs = []
  let debugLogs = []
  const info = logger.info
  const error = logger.error
  const debug = logger.debug

  const producer = new Kafka.Producer(helper.getKafkaOptions())

  /**
   * Sleep with time from input
   * @param time the time input
   */
  async function sleep (time) {
    await new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  /**
   * Send message
   * @param testMessage the test message
   */
  async function sendMessage (testMessage) {
    await producer.send({
      topic: testMessage.topic,
      message: {
        value: JSON.stringify(testMessage)
      }
    })
  }

  /**
   * Consume not committed messages before e2e test
   */
  async function consumeMessages () {
    // remove all not processed messages
    const consumer = new Kafka.GroupConsumer(helper.getKafkaOptions())
    await consumer.init([{
      subscriptions: [config.UBAHN_AGGREGATE_TOPIC, config.GROUPS_MEMBER_ADD_TOPIC, config.GROUPS_MEMBER_DELETE_TOPIC],
      handler: (messageSet, topic, partition) => Promise.each(messageSet,
        (m) => consumer.commitOffset({ topic, partition, offset: m.offset }))
    }])
    // make sure process all not committed messages before test
    await sleep(2 * config.WAIT_TIME)
    await consumer.end()
  }

  /**
   * Wait job finished with successful log or error log is found
   */
  async function waitJob () {
    while (true) {
      if (errorLogs.length > 0) {
        break
      }
      if (debugLogs.some(x => String(x).includes('Successfully processed message'))) {
        break
      }
      // use small time to wait job and will use global timeout so will not wait too long
      await sleep(config.WAIT_TIME)
    }
  }

  function assertErrorMessage (message) {
    errorLogs.should.not.be.empty()
    errorLogs.some(x => String(x).includes(message)).should.be.true()
  }

  before(async () => {
    await init(true)

    // inject logger with log collector
    logger.info = (message) => {
      infoLogs.push(message)
      info(message)
    }
    logger.debug = (message) => {
      debugLogs.push(message)
      debug(message)
    }
    logger.error = (message) => {
      errorLogs.push(message)
      error(message)
    }
    await consumeMessages()
    // start kafka producer
    await producer.init()
    // start the application (kafka listener)
    app = require('../../src/app')
    // wait until consumer init successfully
    while (true) {
      if (infoLogs.some(x => String(x).includes('Kick Start'))) {
        break
      }
      await sleep(config.WAIT_TIME)
    }
  })

  after(async () => {
    // restore logger
    logger.error = error
    logger.info = info
    logger.debug = debug

    try {
      await producer.end()
    } catch (err) {
      // ignore
    }
    try {
      await app.end()
    } catch (err) {
      // ignore
    }

    await clearES()
  })

  beforeEach(() => {
    // clear logs
    infoLogs = []
    debugLogs = []
    errorLogs = []
  })

  it('Should setup healthcheck with check on kafka connection', async () => {
    const healthcheckEndpoint = `http://localhost:${process.env.PORT || 3000}/health`
    const result = await request.get(healthcheckEndpoint)
    should.equal(result.status, 200)
    should.deepEqual(result.body, { checksRun: 1 })
    debugLogs.should.match(/connected=true/)
  })

  it('Should handle invalid json message', async () => {
    await producer.send({
      topic: testTopics.Create[0].topic,
      message: {
        value: '[ invalid'
      }
    })
    await waitJob()
    should.equal(errorLogs[0], 'Invalid message JSON.')
  })

  it('Should handle incorrect topic field message', async () => {
    const message = _.cloneDeep(testTopics.Create[0])
    message.topic = 'invalid'
    await producer.send({
      topic: testTopics.Create[0].topic,
      message: {
        value: JSON.stringify(message)
      }
    })
    await waitJob()
    should.equal(errorLogs[0], 'The message topic invalid doesn\'t match the Kafka topic u-bahn.action.aggregate.')
  })

  for (const op of ['Create', 'Update', 'Delete']) {
    for (let i = 0; i < testTopics[op].length; i++) {
      const resource = _.upperFirst(testTopics[op][i].payload.resource)
      it(`process ${_.lowerFirst(op)} ${resource} success`, async () => {
        if (op === 'Delete' || (op === 'Update' && i < 11)) {
          // ensure document exist before delete or update
          try {
            await getESRecord(testTopics[op][i].payload)
          } catch (e) {
            throw new Error('should not throw error here')
          }
        }

        if (op !== 'Update' || i < 11) {
          await sendMessage(testTopics[op][i])
          await waitJob()
        }

        if (op === 'Delete') {
          // ensure document not exist after delete
          try {
            await getESRecord(testTopics[op][i].payload)
            throw new Error('should not throw error here')
          } catch (e) {
            should.equal(e.statusCode, 404)
            e.message.should.startWith('[resource_not_found_exception]')
          }
        } else if (op !== 'Update' || i < 11) {
          const ret = await getESRecord(testTopics[op][i].payload)
          if (testTopics[op][i].payload.resource === 'user') {
            should.equal(ret.handle, testTopics[op][i].payload.handle)
          } else {
            should.deepEqual(ret, _.omit(testTopics[op][i].payload, ['resource', 'originalTopic']))
          }
        }
      })

      if (op === 'Update' && i >= 11) {
        // ensure document doesn't exist before update
        // when perform update operation later, it will throw error
        it(`failure - process update ${resource} with document doesn't exist`, async () => {
          await sendMessage(testTopics[op][i])
          await waitJob()
          if (topResources[_.lowerFirst(resource)]) {
            assertErrorMessage('Not Found')
          } else {
            assertErrorMessage('[resource_not_found_exception]')
          }
        })
      }

      if (op === 'Create') {
        it(`failure - process create ${resource} with duplicate id`, async () => {
          await sendMessage(testTopics[op][i])
          await waitJob()

          assertErrorMessage('[version_conflict_engine_exception]')
        })
      }

      if (op === 'Delete') {
        it(`failure - process delete ${resource} not found`, async () => {
          await sendMessage(testTopics[op][i])
          await waitJob()
          if (topResources[_.lowerFirst(resource)]) {
            assertErrorMessage('Not Found')
          } else {
            assertErrorMessage('[resource_not_found_exception]')
          }
        })
      }
    }

    for (const resourceKey in fields) {
      const messageIndex = fields[resourceKey][`${_.lowerFirst(op)}Index`]
      // there is not update role test data
      if (!messageIndex) {
        continue
      }
      for (const requiredField of fields[resourceKey].requiredFields) {
        it(`test process ${_.lowerFirst(op)} ${resourceKey} message with invalid parameters, required field ${requiredField} is missing`, async () => {
          let message = _.cloneDeep(testTopics[op][messageIndex])
          message = _.omit(message, requiredField)

          await sendMessage(message)
          await waitJob()

          assertErrorMessage(`"${_.last(requiredField.split('.'))}" is required`)
        })

        if (requiredField !== 'payload.resource') {
          it(`test process ${_.lowerFirst(op)} ${resourceKey} message with invalid parameters, invalid string field ${requiredField}`, async () => {
            const message = _.cloneDeep(testTopics[op][messageIndex])
            _.set(message, requiredField, '12345')

            await sendMessage(message)
            await waitJob()

            assertErrorMessage(`"${_.last(requiredField.split('.'))}" must be a valid GUID`)
          })
        }
      }
    }

    it(`test process ${_.lowerFirst(op)} message with incorrect resource, message is ignored`, async () => {
      const message = _.cloneDeep(testTopics[op][0])
      message.payload.resource = 'invalid'

      await sendMessage(message)
      await waitJob()

      should.equal(_.last(infoLogs), `Ignore this message since resource is not in [${_.union(_.keys(topResources), _.keys(userResources), _.keys(organizationResources))}]`)
    })
  }

  describe('UBahn - Elasticsearch Groups Processor E2E Test', () => {
    before(async () => {
      await sendMessage(testTopics.Create[0])
      await waitJob()
      await sleep(1000)
    })

    after(async () => {
      await sendMessage(testTopics.Delete[11])
      await waitJob()
    })

    it(`test process add groups member message success`, async () => {
      const message = groupsTopics.addData.payload
      await sendMessage(groupsTopics.addData)
      await waitJob()
      await sleep(1000)
      const ret = await getESGroupRecord(message.universalUID, message.groupId)
      const { groupId, name: groupName } = message
      should.deepEqual(ret, { id: groupId, name: groupName })
    })

    it(`test process add groups member message with duplicate id`, async () => {
      await sendMessage(groupsTopics.addData)
      await waitJob()
      assertErrorMessage('[version_conflict_engine_exception]')
    })

    it(`test process add groups member message with ignore membershipType`, async () => {
      const message = _.cloneDeep(groupsTopics.addData)
      message.payload.membershipType = 'ignore'
      await sendMessage(message)
      await waitJob()
      should.equal(_.last(infoLogs), `Ignoring this groups member add message since membershipType is not 'user'`)
    })

    it(`test process remove groups member message success`, async () => {
      await sendMessage(groupsTopics.deleteData)
      await waitJob()
    })

    it(`test process remove groups member message with user not exist in group`, async () => {
      await sendMessage(groupsTopics.deleteData)
      await waitJob()
      assertErrorMessage('[resource_not_found_exception]')
    })
  })
})
