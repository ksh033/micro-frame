import roleApi from './role'
export default {
  // 模块
  system: {
    getApplist: {
      url: '/user/api/anony/sys/list',
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
      sysCode: 'user',
    },

    /** 修改当前用户信息用户(响应userId)--已完成 */
    updateCurrentUser: {
      url: '/user/api/currentUser/update',
      method: 'post',
      sysCode: 'user',
    },

    /** 查询用户管理机构下拉列表（角色管理）--已完成 */
    listRoleDept: {
      url: '/user/api/deptrole/listdept',
      method: 'get',
      sysCode: 'user',
    },

    /** 查询用户管理机构下拉列表（用户管理）--已完成 */
    listUserDept: {
      url: '/user/api/deptUser/listdept',
      method: 'get',
      sysCode: 'user',
    },

    /** 新增用户(响应userId)--已完成 */
    formSubmit: { url: '/user/api/user/add', method: 'post', sysCode: 'user' },

    /** 删除用户(响应userId)--已完成 */
    delete: { url: '/user/api/user/delete', method: 'post', sysCode: 'user' },

    /** 启用禁用用户(响应userId)--已完成 */
    enable: { url: '/user/api/user/enable', method: 'post', sysCode: 'user' },

    /** 根据用户id查询用户--已完成 */
    getUserById: {
      url: '/user/api/user/getuserbyid',
      method: 'post',
      sysCode: 'user',
    },

    /** 分页-查询用户--已完成 */
    queryPage: {
      url: '/user/api/user/page',
      method: 'post',
      sysCode: 'user',
    },

    /** 修改用户(响应userId)--已完成 */
    update: { url: '/user/api/user/update', method: 'post', sysCode: 'user' },

    querySysList: {
      url: '/user/api/deptuser/listsys',
      method: 'get',
      sysCode: 'user',
    },

    queryDeptList: {
      url: '/user/api/deptuser/listdept',
      method: 'get',
      sysCode: 'user',
    },
  },
}
