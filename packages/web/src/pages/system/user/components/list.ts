import { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  queryConfig: [
    {
      label: '用户手机号',
      name: 'phone',
      component: 'Input',
      props: {
        placeholder: '请输入用户姓名',
      },
    },
    {
      label: '所属应用',
      name: 'systemCode',
      component: 'ScSelect',
      props: {
        placeholder: '请输入所属应用',
      },
    },
    {
      label: '所属机构',
      name: 'bizDeptId',
      component: 'ScSelect',
      props: {
        placeholder: '请输入所属机构',
      },
    },
  ],
  tableConfig: [
    {
      title: '手机号',
      dataIndex: 'name',
    },
    {
      title: '姓名',
      dataIndex: 'desc',
    },
    {
      title: '所属应用',
      dataIndex: 'callNo',
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      dataType: 'RoleTypeEnum',
    },
    {
      title: '邮箱',
      dataIndex: 'updatedAt',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      dataType: 'status',
    },
  ],
}
export default pageConfig
