import type { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  formConfig: [
    {
      col: 2,
      fieldset: 'basic',
      fieldsetTitle: '',
      items: [
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
          label: '手机',
          name: 'phone',
          component: 'Input',
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: '请输手机',
          },
        },
        {
          label: '用户姓名',
          name: 'realName',
          component: 'Input',

          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: '请输所属应用',
          },
        },

        {
          label: '角色授权',
          name: 'sysRoleList',
          component: 'ScSelect',
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: '请选择角色',
            textField: 'roleName',
            valueField: 'roleId',
            mode: 'multiple',
            request: 'listDeptRole',
            autoload: true,
          },
        },

        {
          label: '邮箱',
          name: 'email',
          component: 'Input',
          formItemProps: {
            rules: [
              {
                type: 'email',
                message: '请输正确的邮箱地址',
              },
            ],
          },
          props: {
            placeholder: '请输邮箱',
          },
        },
        {
          title: '',
          label: '备注',
          name: 'remark',
          component: 'Input',
          colProps: {
            span: 24,
          },

          props: {
            placeholder: '备注',
          },
        },
      ],
    },
  ],
}

export default pageConfig
