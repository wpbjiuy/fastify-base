const fastifyPlugin = require('fastify-plugin')

async function decorates(fastify, options) {
  // 日期格式化 {y}-{m}-{d} {h}:{i}:{s}
  fastify.decorate('dateFormat', function(time, cFormat) {
    if (arguments.length === 0 || !time) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string')) {
        if ((/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        } else {
          time = time.replace(new RegExp(/-/gm), '/')
        }
      }
  
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
      return value.toString().padStart(2, '0')
    })
    return time_str
  })

  const deleteCollection = fastify.mongo.db.collection('deletes')
  // 添加到删除库
  fastify.decorate('addDeleteData', function(collection, data) {
    const dateTime = fastify.dateFormat(new Date(), '{y}-{m}-{d}')
    deleteCollection.findOneAndUpdate({
      dateTime 
    }, {
      $set: {
        dateTime,
        collection
      },
      $push: {
        items: data
      }
    })
  })

  fastify.decorateRequest('addQueryId', function(query) {
    let _id = (this.body || {})._id || this.query._id
    if (_id) {
      const ids = _id.split(',')
      _id = ids.length > 1 ? { $in: ids.map(id => fastify.mongo.ObjectId(id)) } : fastify.mongo.ObjectId(_id)
      query._id = _id
    }
  })
}

module.exports = fastifyPlugin(decorates)