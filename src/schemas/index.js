const fastifyPlugin = require('fastify-plugin')
const IdSchema = {
  $id: 'queryId',
  type: 'object',
  required: ['id'],
  propreties: {
    id: {
      type: 'string'
    }
  }
}

const PublicQuerySchema = {
  $id: 'publicQuery',
  type: 'object',
  propreties: {
    id: {
      type: 'string'
    },
    projection: {
      type: 'object'
    }
  }
}

const DeleteSchema = {
  $id: 'deleteDatas',
  type: 'object',
  properties: {
    dateTime: {
      type: 'string',
      format: 'date-time'
    },
    collection: {
      type: 'string'
    },
    items: {
      type: 'array',
      item: { type: 'object' }
    }
  }
}

async function addSchema(fastify, options) {
  fastify.addSchema(IdSchema)
  fastify.addSchema(PublicQuerySchema)
} 

module.exports = {
  addSchema: fastifyPlugin(addSchema),
  IdSchema
}