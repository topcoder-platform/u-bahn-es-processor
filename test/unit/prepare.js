/*
 * Setting up Mock for all tests
 */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const nock = require('nock')
const prepare = require('mocha-prepare')

const content = {}

prepare(function (done) {
  // called before loading of test cases
  nock(/.com|localhost/)
    .persist()
    .post(uri => uri.includes('_create'))
    .query(true)
    .reply((uri, body) => {
      const id = _.last(_.split(uri, '/')).split('?')[0]
      if (content[id]) {
        return [409]
      } else {
        content[id] = body
        return [200]
      }
    })
    .post(uri => uri.includes('_update'))
    .query(true)
    .reply((uri, body) => {
      const id = _.last(_.split(uri, '/')).split('?')[0]
      if (content[id]) {
        content[id] = body.doc
        return [200]
      } else {
        return [404]
      }
    })
    .delete(() => true)
    .query(true)
    .reply(uri => {
      const id = _.last(_.split(uri, '/')).split('?')[0]
      if (content[id]) {
        _.unset(content, id)
        return [204]
      } else {
        return [404]
      }
    })
    .get(uri => uri.includes('_source'))
    .query(true)
    .reply(uri => {
      const id = _.last(_.split(uri, '/')).split('?')[0]
      if (content[id]) {
        return [200, content[id]]
      } else {
        return [404]
      }
    })
    .get(uri => uri.includes('_doc'))
    .query(true)
    .reply(uri => {
      const id = _.last(_.split(uri, '/')).split('?')[0]
      if (content[id]) {
        return [200, { '_source': content[id] }]
      } else {
        return [404]
      }
    })
    .get(() => true)
    .query(true)
    .reply(404)
  done()
}, function (done) {
  // called after all test completes (regardless of errors)
  _.unset(content, '*')
  nock.cleanAll()
  done()
})
