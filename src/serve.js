'use strict'

const server = require('./app')({
  logger: {
    level: 'info',
    prettyPrint: true,
    CHCP: 936
  },
  ajv: require('./plugins/ajv-options')
})

server.listen(3000, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  // server.log.info(`服务器监听地址： ${address}`)
  // server.log.info(`server listening on ${address}`)
})