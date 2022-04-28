export default {
  queryPage: {
    url: '/user/api/role/page',
    method: 'post',
  },
  remove: {
    url: '/user/api/role/delete',
    method: 'get',
  },
  disabled: {
    url: '/user/api/role/enable',
    method: 'get',
  },
  getPermTree: {
    url: '/user/api/functionperm/getpermtree',
    method: 'get',
  },
  listDeptRole: {
    url: '/user/api/role/listdeptrole',
    method: 'post',
  },
  listsys: {
    url: '/user/api/deptuser/listsys',
    method: 'get',
  },
  listDept: {
    url: '/user/api/deptrole/listdept',
    method: 'get',
  },
  /** 新增用户(响应userId)--已完成 */
  formSubmit: {
    url: '/user/api/role/add',
    method: 'post',
  },
  /** 新增用户(响应userId)--已完成 */
  formUpdate: {
    url: '/user/api/role/update',
    method: 'post',
  },
  queryById: {
    url: '/user/api/role/getrolebyid',
    method: 'get',
  },
};
