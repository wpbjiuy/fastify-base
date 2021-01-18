const fastifyPlugin = require('fastify-plugin')
const localize = require('ajv-i18n')
const errTxt = Object.fromEntries(Object.entries(require('../data/errtxt')).map(d => [d[1].code, d[1]]))

async function setting(fastify, options) {
  fastify.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
      localize.zh(error.validation)
      reply.status(400).send(error.validation)
      return
    }
    const errObj = errTxt[error.message]
    if (errObj) {
      error.code = errObj.code
      error.message = errObj.msg
      reply.status(errObj.statusCode)
    } else {
      error.code = '1111'
    }
    // console.log(error)
    reply.send(error)
  })
}

module.exports = fastifyPlugin(setting)