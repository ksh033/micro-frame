import { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  queryConfig: [
    {
      label: '角色名称',
      name: 'roleName',
      component: 'Input',
      props: {
        placeholder: '请输入角色名称',
      },
    },
    {
      label: '所属应用',
      name: 'systemCode',
      component: 'ScSelect',
      props: {
        autoload: true,
        request: 'listsys',
        allowClear: true,
        placeholder: '请选择所属应用',
        textField: 'systemName',
        valueField: 'systemCode',
      },
    },
  ],
  tableConfig: [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
    },
    {
      title: '所属应用',
      dataIndex: 'systemName',
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      dataType: 'RoleTypeEnum',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      dataType: 'status',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ],
}
export default pageConfig
