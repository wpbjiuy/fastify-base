'use strict'

const fastify = require('fastify')
const { addSchema } = require('./schemas')

function build(opts={}) {
  const app = fastify(opts)

  app.register(require('./setting'))
  app.register(require('./plugins'))
  app.register(require('./db-connector'))
  app.register(addSchema)
  app.register(require('./decorate'))
  app.register(require('./router'))
  app.register(require('./hook'))

  return app
}

module.exports = build