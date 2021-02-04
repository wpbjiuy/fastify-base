const fastifyPlugin = require('fastify-plugin')
const append = require('vary').append

async function hook(fastify, options) {
  fastify.addHook('onRequest', async (req, reply) => {
    // 其他代码
    req.log.info({ url: req.raw.url, id: req.id, query: req.query }, '已请求')
  })

  fastify.addHook('onResponse', async (req, reply) => {
    req.log.info({ url: req.raw.originalUrl, statusCode: reply.raw.statusCode, reqBody: req.body }, '已响应')
  })
  
  
  fastify.addHook('onSend', async (req, reply) => {
    if (req.headers['accept-version']) { // 或其他自定义 header
      let value = reply.getHeader('Vary') || ''
      const header = Array.isArray(value) ? value.join(', ') : String(value)
      if ((value = append(header, 'Accept-Version'))) { // 或其他自定义 header
        reply.header('Vary', value)
      }
    }
  })
}

module.exports = fastifyPlugin(hook)