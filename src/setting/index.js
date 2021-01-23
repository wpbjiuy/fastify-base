const fastifyPlugin = require('fastify-plugin')
const localize = require('ajv-i18n')
const errTxt = Object.fromEntries(Object.entries(require('../data/errtxt')).map(d => [d[1].code, d[1]]))

async function setting(fastify, options) {
  fastify.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
      localize.zh(error.validation)
      reply.status(400).send({
        code: '4000',
        statusCode: 400,
        error: error.error,
        message: error.validation.map(d => `字段‘${d.dataPath}’，${d.message}`).join('\n')
      })
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
    reply.send(error)
  })
}

module.exports = fastifyPlugin(setting)