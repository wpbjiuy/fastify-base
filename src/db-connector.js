const fastifyPlugin = require('fastify-plugin')

async function dbConnector (fastify, options) {
  fastify.register(require('fastify-mongodb'), {
    url: 'mongodb://localhost:27017/test_database'
  })
}
// 用 fastify-plugin 包装插件，以使插件中声明的装饰器、钩子函数暴露在根作用域里。
module.exports = fastifyPlugin(dbConnector)