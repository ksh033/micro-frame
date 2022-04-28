import roleApi from './role';

export default {
  // 模块
  system: {
    getPublicKey: {
      url: '/user/api/anony/publickey/get',
      method: 'get',
    },
  },
  user: {
    loginByPhone: {
      url: '/user/api/anony/operator/web/login/phonepwd',
      method: 'get',
    },
    chooseDept: {
      url: '/user/api/operator/dept/choose',
      method: 'get',
    },
    update: {
      url: '/user/api/currentuser/update',
      method: 'post',
    },
    changePwd: {
      url: '/user/api/user/mypassword/update',
      method: 'post',
    },
    bindwx: {
      url: '/user/api/wechat/webapp/operate/bind',
      method: 'get',
    },
    unbindwx: {
      url: '/user/api/wechat/webapp/operate/unbind',
      method: 'get',
    },
  },
  role: roleApi,
  deptUser: {
    /** 新增或更换管理员--已完成 */
    set: { url: '/user/api/adminuser/set', method: 'post' },

    /** 查询当前登陆用户信息--已完成 */
    detail: {
      url: '/user/api/currentUser/detail',
      method: 'get',
    },

    /** 修改当前用户信息用户(响应userId)--已完成 */
    updateCurrentUser: {
      url: '/user/api/currentUser/update',
      method: 'post',
    },

    /** 查询用户管理机构下拉列表（角色管理）--已完成 */
    listRoleDept: {
      url: '/user/api/deptrole/listdept',
      method: 'get',
    },

    /** 查询用户管理机构下拉列表（用户管理）--已完成 */
    listUserDept: {
      url: '/user/api/deptUser/listdept',
      method: 'get',
    },

    /** 新增用户(响应userId)--已完成 */
    formSubmit: {
      url: '/user/api/user/add',
      method: 'post',
    },

    /** 删除用户(响应userId)--已完成 */
    remove: { url: '/user/api/user/delete', method: 'get' },

    /** 启用禁用用户(响应userId)--已完成 */
    disabled: {
      url: '/user/api/user/enable',
      method: 'get',
    },

    /** 根据用户id查询用户--已完成 */
    queryById: {
      url: '/user/api/user/getuserbyid',
      method: 'get',
    },

    /** 分页-查询用户--已完成 */
    queryPage: {
      url: '/user/api/user/page',
      method: 'post',
    },

    /** 修改用户(响应userId)--已完成 */
    formUpdate: {
      url: '/user/api/user/update',
      method: 'post',
    },

    querySysList: {
      url: '/user/api/deptuser/listsys',
      method: 'get',
    },

    queryDeptList: {
      url: '/user/api/deptuser/listdept',
      method: 'get',
    },
    resetPassword: {
      url: '/user/api/user/password/reset',
      method: 'get',
    },
  },
};
