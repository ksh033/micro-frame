import roleApi from './role'

export default {
  // 模块
  system: {
    getApplist: {
      url: '/user/api/anony/sys/list',
      method: 'get',
      sysCode: 'common',
    },
    getPublicKey: {
      url: '/user/api/anony/publickey/get',
      method: 'get',
      sysCode: 'common',
    },
  },
  user: {
    loginByPhone: {
      url: '/user/api/anony/user/login/dev',
      method: 'get',
      sysCode: 'common',
    },
    chooseDept: {
      url: '/user/api/dept/choose',
      method: 'get',
      sysCode: 'common',
    },
    chooseSys: {
      url: '/user/api/sys/choose',
      method: 'get',
      sysCode: 'common',
    },
    update: {
      url: '/user/api/currentuser/update',
      method: 'post',
      sysCode: 'usersys',
    },
    changePwd: {
      url: '/user/api/user/mypassword/update',
      method: 'post',
      sysCode: 'usersys',
    },
    bindwx: {
      url: '/user/api/wechat/webapp/operate/bind',
      method: 'get',
      sysCode: 'common',
    },
    unbindwx: {
      url: '/user/api/wechat/webapp/operate/unbind',
      method: 'get',
      sysCode: 'common',
    },
  },
  role: roleApi,
  deptUser: {
    /** 用户机构服务接口 */

    /** 新增或更换管理员--已完成 */
    set: { url: '/user/api/adminuser/set', method: 'post', sysCode: 'user' },

    /** 查询当前登陆用户信息--已完成 */
    detail: {
      url: '/user/api/currentUser/detail',
      method: 'get',
      sysCode: 'usersys',
    },

    /** 修改当前用户信息用户(响应userId)--已完成 */
    updateCurrentUser: {
      url: '/user/api/currentUser/update',
      method: 'post',
      sysCode: 'usersys',
    },

    /** 查询用户管理机构下拉列表（角色管理）--已完成 */
    listRoleDept: {
      url: '/user/api/deptrole/listdept',
      method: 'get',
      sysCode: 'usersys',
    },

    /** 查询用户管理机构下拉列表（用户管理）--已完成 */
    listUserDept: {
      url: '/user/api/deptUser/listdept',
      method: 'get',
      sysCode: 'usersys',
    },

    /** 新增用户(响应userId)--已完成 */
    formSubmit: {
      url: '/user/api/user/add',
      method: 'post',
      sysCode: 'usersys',
    },

    /** 删除用户(响应userId)--已完成 */
    remove: { url: '/user/api/user/delete', method: 'get', sysCode: 'usersys' },

    /** 启用禁用用户(响应userId)--已完成 */
    disabled: {
      url: '/user/api/user/enable',
      method: 'get',
      sysCode: 'usersys',
    },

    /** 根据用户id查询用户--已完成 */
    queryById: {
      url: '/user/api/user/getuserbyid',
      method: 'get',
      sysCode: 'usersys',
    },

    /** 分页-查询用户--已完成 */
    queryPage: {
      url: '/user/api/user/page',
      method: 'post',
      sysCode: 'usersys',
    },

    /** 修改用户(响应userId)--已完成 */
    formUpdate: {
      url: '/user/api/user/update',
      method: 'post',
      sysCode: 'usersys',
    },

    querySysList: {
      url: '/user/api/deptuser/listsys',
      method: 'get',
      sysCode: 'usersys',
    },

    queryDeptList: {
      url: '/user/api/deptuser/listdept',
      method: 'get',
      sysCode: 'usersys',
    },
    resetPassword: {
      url: '/user/api/user/password/reset',
      method: 'get',
      sysCode: 'usersys',
    },
  },
}
