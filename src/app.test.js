'use strict'

const build = require('./app')

let algorithm = 'aes-128-cbc'
let key = '1234567812122312'
let iv = '1234567890123456'
let cryptojs = require('crypto-js')

const getUUID = () => {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}

function addHas(data, key, iv) {
  return cryptojs.AES.encrypt(data, cryptojs.enc.Utf8.parse(key), {
    iv: cryptojs.enc.Utf8.parse(iv),
    mode: cryptojs.mode.CBC,
    padding: cryptojs.pad.Pkcs7
  }).toString()
}

const test = async () => {
  const app = build({
    ajv: require('./plugins/ajv-options')
  })

  const response = await app.inject({
    method: 'post',
    url: '/mail/captcha',
    // query: { id: '6004f89194567c4b90ba190a' },
    body: { mail: 'wpbjiuy@163.com' }
  })

  console.log('status code: ', response.statusCode)
  console.log('body: ', response.body)

  app.close()
}

test()

const testAddLogin = async () => {
  const app = build()

  const body = {
    name: addHas('admin'),
    password: addHas('123456')
  }
  const response = await app.inject({
    method: 'post',
    url: '/login/create',
    body
  })

  console.log('status code: ', response.statusCode)
  console.log('body: ', response.body)

  app.close()
}

const testUserLogin = async () => {
  const app = build()
  const aes = getUUID()
  const key = aes.replace(/-/g, '')
  const iv = key.replace(/-/g, aes.charAt(0)).slice(0, 16);

  const body = {
    name: addHas('admin', key, iv),
    password: addHas('12345612', key, iv)
  }
  const response = await app.inject({
    method: 'post',
    url: '/login',
    body,
    headers: {
      aes
    }
  })

  console.log('status code: ', response.statusCode)
  console.log('body: ', response.body)

  app.close()
}

const testGetUser = async (id) => {
  const app = build()

  const query = { id }
  const response = await app.inject({
    method: 'get',
    url: '/user/get',
    query
  })

  console.log('status code: ', response.statusCode)
  console.log('body: ', response.body)

  app.close()
}

const testUpdateUser = async (id) => {
  const app = build()

  const query = { id }

  const body = {
    name: addHas('test1'),
    password: addHas('123456')
  }
  const response = await app.inject({
    method: 'put',
    url: '/login/update',
    query,
    body
  })

  console.log('status code: ', response.statusCode)
  console.log('body: ', response.body)

  app.close()
}

// testGetUser('5ffbb68edc29293ac470eb0d')

// testUpdateUser('5ff5242fd377ca6dfc0c1acc')

// testAddLogin()

// testUserLogin()

const testAddUser = async () => {
  const app = build()

  const body = {
    _id: "5ffbb68edc29293ac470eb0d",
    name: '王神',
    sex: 'M',
    birthday: '1989-03-08',
    address: '王神宫'
  }
  const response = await app.inject({
    method: 'post',
    url: '/user/create',
    body
  })

  console.log('status code: ', response.statusCode)
  console.log('body: ', response.body)

  app.close()
}

const testGetUserCurrent = async (id) => {
  const app = build()

  const response = await app.inject({
    method: 'get',
    url: '/user/current'
  })

  console.log('status code: ', response.statusCode)
  console.log('body: ', response.body)

  app.close()
}

// testAddUser()

// testGetUserCurrent() 
