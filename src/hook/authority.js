const fastifyPlugin = require('fastify-plugin')
const { NOT_AUTHENTICATION } = require('../data/errtxt')
const { notAuthPath, getAuthPath } = require('../data/router')

async function hook(fastify, options) {
  fastify.addHook('onRequest', (request, reply, done) => {
    // 其他代码
    if (!notAuthPath.includes(request.routerPath)) {
      const user = request.session.get('user')
      if (!user || !user._id || !getAuthPath(user.role).includes(request.routerPath)) {
        throw new Error(NOT_AUTHENTICATION.code)
      }
      request.session.changed = true
      request.session.options({ maxAge: 60 * 60 * 2 })
    }
    done()
  })
}

module.exports = fastifyPlugin(hook)
