const NOT_QUERY = {
  statusCode: '414',
  code: '1000',
  msg: '没有查询到数据'
}
const NOT_UPDTE = {
  statusCode: '413',
  code: '1001',
  msg: '更新数据失败'
}
const NOT_CAPTCHA = {
  statusCode: '405',
  code: '1005',
  msg: '验证码错误'
}
const NOT_AUTHENTICATION = {
  statusCode: '406',
  code: '1006',
  msg: '身份校验不通过，请重新登录'
}
const NOT_USERNAME = {
  statusCode: '401',
  code: '10011',
  msg: '用户名错误'
}
const NOT_PASSWORD = {
  statusCode: '401',
  code: '10012',
  msg: '用户密码错误'
}

module.exports = {
  NOT_QUERY,
  NOT_UPDTE,
  NOT_AUTHENTICATION,
  NOT_CAPTCHA,
  NOT_USERNAME,
  NOT_PASSWORD
}