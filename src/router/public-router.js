const { NOT_QUERY, NOT_UPDTE } = require('../data/errtxt')
async function routes (fastify, options) {
  if (!options.collection) {
    throw new Error('请添加数据集名称')
  }
  const collection = fastify.mongo.db.collection(options.collection)

  // collection.dropIndex("name")

  // 添加登录权限
  options.auth && fastify.register(require('../hook/authority'))

  fastify.route({
    method: ['GET', 'POST'],
    url: '/get',
    schema: options.querySchema || {
      querystring: { $ref: 'publicQuery' }
    },
    handler: async (request, reply) => {
      const query = { ...(request.body || {}), ...request.query }
      request.addQueryId(query)
      const isFindOne = query._id && !query._id.$in
      const projection = {}
      let limit = 0
      let page = 1

      if (query.projection) {
        projection = query.projection
        delete query.projection
      }
      if (query.limit) {
        limit = query.limit
        delete query.limit
      }
      if (query.page) {
        page = query.page
        delete query.page
      }

      if (!query._type) {
        query._type = { $ne: 'remove' }
      }

      const result = isFindOne
        ? await collection.findOne(query, projection)
        : await collection.find(query, projection).toArray()
      if (!result) {
        throw new Error(NOT_QUERY.code)
      }
      const startPage = (page - 1) * limit
      const endPage = limit ? (startPage + limit) : result.length

      return (isFindOne || result.length === undefined) ? result : {
        datas: result.slice(startPage, endPage),
        total: result.length
      }
    }
  })

  fastify.post('/create', { schema: options.createSchema || {} }, async (request, replay) => {
    const body = { ...request.body, _type: 'create' }
    const result = await collection.insertOne(body).catch(err => err)

    return result && result.ops && result.ops[0] || result
  })

  fastify.put('/update', { schema: options.updateSchema || {} }, async (request, replay) => {
    const query = { ...request.query }
    const body = request.body
    request.addQueryId(query)
    if (body.query) {
      Object.assign(query, body.query)
      delete body.query
    }
    if (body._id) {
      delete body._id
    }

    const result = await collection.updateMany(query, { $set: { ...body, _type: 'update' } }).catch(err => ({err: err}))

    if (!result) {
      throw new Error(NOT_UPDTE.code)
    }

    if (result.err) {
      return result.err
    }

    if (!result.result || !result.result.n || !result.result.nModified) {
      throw new Error((!result.result || !result.result.n) ? NOT_QUERY.code : NOT_UPDTE.code)
    }
    const isFindOne = query._id && !query._id.$in
    const queryResult = isFindOne
      ? await collection.findOne(query)
      : await collection.find(Object.assign(query, body)).toArray()

    return queryResult
  })

  fastify.put('/updateById', { schema: options.updateByIdSchema || { querystring: { $ref: 'queryId' } } }, async (request, replay) => {
    const query = request.query
    const body = request.body
    const _id = fastify.mongo.ObjectId(query.id)
    const result = await collection.findOneAndUpdate({ _id }, { $set: body }).catch(err => err)

    if (!result) {
      throw new Error(NOT_QUERY.code)
    }
    
    return Object.assign(result.value, body)
  })

  fastify.post('/delete', { schema: options.deleteSchema || {} }, async (request, replay) => {
    const query = request.body || request.query
    request.addQueryId(query)

    const result = await collection.updateMany(query, { $set: { _type: 'remove' } }).catch(err => err)

    if (!result) {
      throw new Error(NOT_QUERY.code)
    }

    return result
  })

  fastify.delete('/delete', { schema: options.deleteSchema || {} }, async (request, replay) => {
    const query = request.body || request.query
    request.addQueryId(query)

    const result = await collection.deleteMany(query).catch(err => err)

    if (!result) {
      throw new Error(NOT_QUERY.code)
    }

    return result
  })
}

module.exports = routes