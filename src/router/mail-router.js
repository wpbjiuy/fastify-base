 //引入模块 nodemailer
const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

const config = {
  // 163邮箱 为smtp.163.com
  host: 'smtp.qq.com',//这是qq邮箱
  //端口
  port: 465,
  auth: {
    // 发件人邮箱账号
    user: '1037233318@qq.com', 
    //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
    pass: 'ueheamxazrwxbbac'  
  }
}

const mailCfg = {
  // 发件人 邮箱  '昵称<发件人邮箱>'
  from: '王神<1037233318@qq.com>',
  // 主题
  subject: '激活验证码',
  // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
  to: '1928611412@qq.com',
  // 内容
  text: `您的激活验证码为：11111, 请24小时内有效，请谨慎保管。` ,
  //这里可以添加html标签
  html: '<a href="https://www.wpbjiuy.com/">王神</a>'
}

function getCaptchaCode() {
  let code = Math.floor((Math.random() * 10000))

  if ((code + '').length < 4) {
    code = getCaptchaCode()
  }
  return code
}

async function routes (fastify, options) {
  fastify.post('/captcha', {
    schema: {
      body: {
        type: 'object',
        required: ['mail'],
        properties: {
          mail: {
            type: 'string'
          }
        }
      }
    }
  }, function(req, rep) {
    console.log('mail captcha', req.session.get('mailCaptcha'))
    if (req.session.get('mailCaptcha')) {
      throw new Error('请不要重复提交')
    }
    const captchaCode = getCaptchaCode()
    const sendCfg = {
      ...mailCfg,
      to: req.body.mail,
      text: `您的激活验证码为：${captchaCode}, 5分钟内有效，请谨慎保管。`,
      html: null
    }

    const transporter = nodemailer.createTransport(config)
    console.log(captchaCode, req.body)
    transporter.sendMail(sendCfg, function(error, info){
      if(error) {
        rep.code(401).send(error)
        return;
      }
      transporter.close()
      // req.session.options({ maxAge: 60 * 5 })
      req.session.set('mailCaptcha', captchaCode)
      console.log('mail sent:', info.response)
      rep.send('发送成功');
    })
  })
}

module.exports = routes