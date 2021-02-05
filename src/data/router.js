// 不需要登录的路由
exports.notAuthPath = [
  '/login',
  '/createSystemUser',
  '/getCaptcha'
]

const baseAuthPath = [
  '/login',
  '/logout',
  '/getCaptcha',
  '/systemUserUpdate',
  '/createSystemUser',
  '/user/current'
]

const AllPath = [
  ...baseAuthPath

  // sytem
  ,'/createSystemUser'
  ,'/getSystem'

  // user
  ,'/user/get'

  // test
  ,'/test/get'
  ,'/test/create'
  ,'/test/update'
  ,'/test/delete'
]

const roleAutPath = {
  A: [...AllPath],
  B: [
    ...baseAuthPath,
    '/createSystemUser',
    '/getSystem'
  ],
  C: [...baseAuthPath],
  D: [...baseAuthPath]
}

/**
 * 
 * @param {string - 角色} role -> A: 超级管理员, B: 管理员, C: 供应商, D：用户
 */
exports.getAuthPath = role => {
  return roleAutPath[role]
}