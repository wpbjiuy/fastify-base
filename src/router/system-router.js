const crypto = require('crypto')
const svgCaptcha = require('svg-captcha')
const UserSchema = require('../schemas/user-schema')

const { NOT_QUERY, NOT_CAPTCHA } = require('../data/errtxt')

const algorithm = 'aes-128-cbc'

const codeConfig = {
  size: 4, // 验证码长度
  ignoreChars: '0oO1ilI', // 验证码字符中排除 0oO1ilI
  noise: 2, // 干扰线条的数量
  width: 160,
  height: 50,
  fontSize: 50,
  color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
  background: '#eee'
};

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

  // 获取验证吗
  fastify.get('/getCaptcha', async (request, replay) => {
    const captcha = svgCaptcha.create(codeConfig)
    // 存session用于验证接口获取文字码
    request.session.set('verifyCode', captcha.text.toLowerCase())
    // request.session.options({ maxAge: 1 })
    replay.type('image/svg+xml')
    return captcha.data;
  })

  fastify.post('/createSystemUser', { schema: { ...UserSchema.postOkSchema } }, async (request, reply) => {
    const body = resUserData(request.body)
    body.role = 'D';
    const result = await collection.insertOne(body).catch(err => err)
    return result && result.ops && result.ops[0]
  })

  fastify.post('/login', { 
    schema: { ...UserSchema.loginResPonseSchema },
    async onError(request, reply, error) {
      request.session.set('isVfyCode', true)
      return error
    }
  }, async (request, reply) => {
    const verifyCode = request.session.get('verifyCode')
    const isVfyCode = request.session.get('isVfyCode')
    // console.log('verifyCode', verifyCode, request.body.captcha.toLowerCase(), isVfyCode)
    if (isVfyCode && (!verifyCode || !request.body.captcha || verifyCode !== request.body.captcha.toLowerCase())) {
      throw new Error(NOT_CAPTCHA.code)
    }
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

  // 获取会话的状态
  fastify.get('/currentTypes', async (request, reply) => {
    const st = request.session.get()
    return {
      isFirstLogin: st.isVfyCode,
      isMayMail: !!st.mailCaptcha
    }
  })
}

module.exports = routes