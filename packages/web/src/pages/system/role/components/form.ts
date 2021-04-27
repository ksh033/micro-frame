import type { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  formConfig: [
    {
      col: 2,
      fieldset: 'basic',
      fieldsetTitle: '角色信息登记',
      items: [
        {
          label: '品目id',
          name: 'roleId',
          component: 'Input',
          hidden: true,
        },
        {
          label: '所属应用',
          name: 'systemCode',
          component: 'ScSelect',
          fieldProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            autoload: true,
            request: 'listsys',
            placeholder: '请选择所属应用',
            textField: 'systemName',
            valueField: 'systemCode',
          },
        },
        {
          label: '所属组织机构',
          name: 'bizDeptId',
          component: 'ScSelect',
          fieldProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            autoload: true,
            request: 'listDept',
            placeholder: '请选择所属组织机构',
            textField: 'bizDeptName',
            valueField: 'bizDeptId',
          },
        },
        {
          label: '角色类型',
          name: 'roleType',
          component: 'DictSelect',
          dataType: 'roleType',
          fieldProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            dictType: 'roleType',
            placeholder: '请选择角色类型',
          },
        },
        {
          label: '角色名称',
          name: 'roleName',
          component: 'Input',
          fieldProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: '请输入角色名称',
          },
        },

        {
          label: '角色描述',
          name: 'roleDesc',
          component: 'Input',
          props: {
            placeholder: '请输入角色描述',
          },
        },
        {
          label: '备注',
          name: 'remark',
          component: 'Input',
          props: {
            placeholder: '请输入备注',
          },
        },
      ],
    },
    {
      col: 1,
      fieldset: 'auth',
      fieldsetTitle: '角色授权',
      items: [
        {
          name: 'sysPermList',
        },
      ],
    },
  ],
}

export default pageConfig
