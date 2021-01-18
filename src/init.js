'use strict'

const fastify = require('fastify')

const app = fastify({})
app.register(require('./db-connector'))

app.ready(async err => {
  if (err) {
    throw err
  }

  const collection = app.mongo.db.collection('test_collection')

  collection.createIndex({name: 1}, {unique: true})
  // collection.dropIndex({name: 1})

  const res = await collection.insertOne({
    name: 'test2',
    mobile: '88888'
  }).catch(err => err)

  console.log('-------res-------')
  console.log(res)

  app.close()
})
