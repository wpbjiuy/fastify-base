'use strict'

const build = require('./app')

let algorithm = 'aes-128-cbc'
let key = '1234567812122312'
let iv = '1234567890123456'
let cryptojs = require('crypto-js')

function addHas(data) {
  return cryptojs.AES.encrypt(data, cryptojs.enc.Utf8.parse(key), {
    iv: cryptojs.enc.Utf8.parse(iv),
    mode: cryptojs.mode.CBC,
    padding: cryptojs.pad.Pkcs7
  }).toString()
}

const test = async () => {
  const app = build()

  const response = await app.inject({
    method: 'put',
    url: '/test/updateById',
    query: { id: '6004f89194567c4b90ba190a' },
    body: { name: '测试Id', mobile: 15219998811, birthday: new Date('2021-02-18') }
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

  const body = {
    name: addHas('admin'),
    password: addHas('123456')
  }
  const response = await app.inject({
    method: 'post',
    url: '/login',
    body
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
