const crypto = require('crypto')
const UserSchema = require('../schemas/user-schema')

const { NOT_QUERY } = require('../data/errtxt')

const algorithm = 'aes-128-cbc'

function hash(data, key) {
  return crypto.createHmac('sha256', key).update(data).digest('hex')
}

function decrypt(algorithm, key, iv, data) {
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAutoPadding(true);
  let decryptData = decipher.update(data, 'base64', 'utf8');
  decryptData += decipher.final('utf8');
  return decryptData
}

function resUserData(data, key, iv) {
  return {
    name: decrypt(algorithm, key, iv, data.name),
    password: hash(decrypt(algorithm, key, iv, data.password), 'wpb')
  }
}

function getKv(aes) {
  const key = aes.replace(/-/g, '')
  const iv = key.replace(/-/g, aes.charAt(0)).slice(0, 16);
  return { key, iv }
}

async function routes (fastify, options) {
  const collection = fastify.mongo.db.collection('test_login')

  collection.createIndex({name: 1}, {unique: true})

  // 添加登录权限
  fastify.register(require('../hook/authority'))

  fastify.post('/createSystemUser', { schema: { ...UserSchema.postOkSchema } }, async (request, reply) => {
    const body = resUserData(request.body)
    body.role = 'D';
    const result = await collection.insertOne(body).catch(err => err)
    return result && result.ops && result.ops[0]
  })

  fastify.post('/login', { schema: { ...UserSchema.loginResPonseSchema } }, async (request, reply) => {
    const { key, iv } = getKv(request.headers.aes)
    const body = resUserData(request.body, key, iv)
    const result = await collection.findOne(body)
    if (!result) {
      throw new Error(NOT_QUERY.code)
    }
    request.session.set('user', result)
    request.session.options({ maxAge: 60 })
    return result && { token: hash(result._id.toString(), key) }
  })

  fastify.get('/logout', async (request, reply) => {
    request.session.delete()
    return {message: '退出登录'}
  })

  // 需要完善
  fastify.get('/getSystem', {
    schema: {
      querystring: { $ref: 'queryId' }
    }
  }, async (request, reply) => {
    const _id = fastify.mongo.ObjectId(request.query.id)
    const result = await collection.findOne({ _id })
    if (!result) {
      throw new Error(NOT_QUERY.code)
    }
    return result
  })

  fastify.put('/systemUserUpdate', {
    schema: {
      querystring: { $ref: 'queryId' },
      ...UserSchema.postOkSchema
    }
  }, async (request, reply) => {
    const _id = fastify.mongo.ObjectId(request.query.id)
    const body = resUserData(request.body)
    const result = await collection.findOneAndUpdate({ _id }, { $set: body })
    if (!result) {
      throw new Error(NOT_QUERY.code)
    }
    return result.value
  })
}

module.exports = routes