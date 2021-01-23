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
  additionalProperties: false,  // 去除额外的属性
  properties: {
    name: {
      type: 'string',
      minLength: 2
    },
    mobile: {
      type: 'string',
      maxLength: 11,
      minLength: 11
    },
    birthday: {
      type: 'string',
      format: 'date',
      // dateRange: true,
      minDate: new Date('2020-01-01'),
      maxDate: new Date(),
      default: new Date().toLocaleDateString().replace(/\//g, '-').replace(/-(?!\d\d)/g, '$&0')
    }
  }
}

const AllSchema = {
  type: ['object', 'null'],
  properties: {
    _id: {
      type: 'string'
    },
    ...DataSchema.properties,
    birthday: {
      ...DataSchema.properties.birthday,
      default: undefined
    }
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