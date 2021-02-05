// 登录信息
const LoginSchema = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 100
    },
    password: {
      type: 'string',
      minLength: 6
    }
  }
}

// 用户信息
const UserSchema = {
  type: 'object',
  required: [
    'name',
    'mobile',
    'sex',
    'birthday',
    'address'
  ],
  properties: {
    name: { // 姓名
      type: 'string'
    },
    mobile: { // 电话
      type: 'number',
      length: 11
    },
    birthday: { // 生日
      type: 'date'
    },
    sex: { // 性别 M: 男, W: 女
      type: 'string',
      enum: ['M', 'W']
    },
    job: { // 职业
      type: 'string'
    },
    address: { // 地址
      type: 'string'
    },
    otherAddress: { // 其它地址
      type: 'array',
      items: {
        type: 'string'
      }
    },
    like: { // 喜好
      type: 'array',
      items: {
        type: 'string'
      }
    },
    tag: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  }
}

const loginResPonseSchema = {
  body: LoginSchema,
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      }
    }
  }
}

const postOkSchema = {
  body: LoginSchema,
  response: {
    200: {
      type: 'object',
      properties: {
        msg: { type: 'string', default: 'ok' }
      }
    }
  }
}

module.exports = {
  LoginSchema,
  UserSchema,
  loginResPonseSchema,
  postOkSchema
}