const fastifyPlugin = require('fastify-plugin')
const fs = require('fs')
const path = require('path')

async function plugins(fastify, options) {
  fastify.register(require('fastify-secure-session'), {
    // the name of the session cookie, defaults to 'session'
    cookieName: 'shike-session-cookie',
    // adapt this to point to the directory where secret-key is located
    key: fs.readFileSync(path.join(__dirname, 'secret-key')),
    cookie: {
      path: '/',
      // options for setCookie, see https://github.com/fastify/fastify-cookie
      maxAge: 60 * 60 * 24
    }
  })
}

module.exports = fastifyPlugin(plugins)