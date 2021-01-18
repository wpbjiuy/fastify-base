const UserSchema = require('../schemas/user-schema')
const { NOT_QUERY } = require('../data/errtxt')

async function routers(fastify, options) {
  const collection = fastify.mongo.db.collection('test_user')
  
  // 添加登录权限
  fastify.register(require('../hook/authority'))

  fastify.post('/create', { schema: UserSchema.UserSchema }, async (response, replay) => {
    const body = response.body
    const result = await collection.insertOne(body).catch(err => err)

    return result && result.ops && result.ops[0]
  })

  fastify.get('/get', {
    schema: {
      querystring: { $ref: 'queryId' }
    }
  }, async (request, reply) => {
    const _id = request.query.id
    const result = await collection.findOne({ _id })
    if (!result) {
      throw new Error(NOT_QUERY.code)
    }
    return result
  })

  fastify.get('/current', async (request, replay) => {
    const _id = request.session.get('user')._id
    const result = await collection.findOne({ _id })
    if (!result) {
      throw new Error(NOT_QUERY.code)
    }
    return result
  })
}

module.exports = routers