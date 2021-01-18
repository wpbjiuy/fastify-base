const stringFz = {
  oneOf: [
    { type: 'string' },
    {
      type: 'object',
      properties: {
        $regex: { type: 'string' }
      }
    }
  ]
}

const DataSchema = {
  type: 'object',
  required: ['name', 'mobile'],
  properties: {
    name: {
      type: 'string'
    },
    mobile: {
      type: 'string',
      maxLength: 11,
      minLength: 11
    },
    birthday: {
      type: 'string',
      format: 'date-time',
      max: new Date(),
      default: new Date()
    }
  }
}

const AllSchema = {
  type: ['object', 'null'],
  properties: {
    _id: {
      type: 'string'
    },
    ...{ ...DataSchema.properties, birthday: {
      type: 'string',
      format: 'date-time',
      max: new Date()
    }}
  }
}

const QuerySchema = {
  type: ['object', 'null'],
  properties: {
    _id: {
      type: 'string'
    },
    name: stringFz,
    mobile: {
      type: 'string',
      minLength: 11,
      maxLength: 11
    },
    projection: {
      type: 'object'
    },
    page: {
      type: 'number',
      minimum: 1
    },
    limit: {
      type: 'number',
      minimum: 1
    }
  }
}

const createSchema = {
  body: DataSchema
}

const querySchema = {
  query: QuerySchema,
  body: QuerySchema
}

const updateSchema = {
  query: {
    type: 'object',
    required: [],
    properties: {
      _id: {
        oneOf: [
          { type: 'string' },
          { type: 'array', item: { type: 'string' } }
        ]
      },
      mobile: {
        type: 'string',
        maxLength: 11,
        minLength: 11
      }
    }
  },
  body: { ...DataSchema, required: [], query: { type: 'object' } }
}

const deleteSchema = {
  query: AllSchema,
  body: AllSchema
}

module.exports = {
  createSchema,
  querySchema,
  updateSchema,
  deleteSchema
}