const fastifyPlugin = require('fastify-plugin')
const testSchemas = require('../schemas/test-schema')
const publicRouter = require('./public-router')
async function routes (fastify, options) {

  fastify.register(require('./system-router'))
  fastify.register(require('./user-router'), {prefix: '/user'})
  fastify.register(publicRouter, {
    prefix: '/test',
    collection: 'test_collection',
    ...testSchemas,
    auth: false
  })
}

module.exports = fastifyPlugin(routes)