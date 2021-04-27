export default {
  queryPage: {
    url: '/user/api/role/page',
    method: 'post',
    sysCode: 'usersys',
  },
  remove: {
    url: '/user/api/role/delete',
    method: 'get',
    sysCode: 'usersys',
  },
  disabled: {
    url: '/user/api/role/enable',
    method: 'get',
    sysCode: 'usersys',
  },
  getPermTree: {
    url: '/user/api/functionperm/getpermtree',
    method: 'get',
    sysCode: 'usersys',
  },
  listDeptRole: {
    url: '/user/api/role/listdeptrole',
    method: 'post',
    sysCode: 'usersys',
  },
  listsys: {
    url: '/user/api/deptuser/listsys',
    method: 'get',
    sysCode: 'usersys',
  },
  listDept: {
    url: '/user/api/deptrole/listdept',
    method: 'get',
    sysCode: 'usersys',
  },
  /** 新增用户(响应userId)--已完成 */
  formSubmit: {
    url: '/user/api/role/add',
    method: 'post',
    sysCode: 'usersys',
  },
  /** 新增用户(响应userId)--已完成 */
  formUpdate: {
    url: '/user/api/role/update',
    method: 'post',
    sysCode: 'usersys',
  },
  queryById: {
    url: '/user/api/role/getrolebyid',
    method: 'get',
    sysCode: 'usersys',
  },
}
