import type { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  formConfig: [
    {
      col: 2,
      fieldset: 'basic',
      fieldsetTitle: '',
      items: [
        {
          label: '品目id',
          name: 'bizDeptUserId',
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
          edit: {
            props: {
              disabled: true,
            },
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
          edit: {
            props: {
              disabled: true,
            },
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
              {
                pattern: '/^1[3|4|5|6|7|8][0-9]{9}$/',
                message: '请输入正确的手机号码',
              },
            ],
          },
          props: {
            placeholder: '请输手机',
          },
          edit: {
            props: {
              disabled: true,
            },
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
          edit: {
            props: {
              disabled: true,
            },
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
            labelInValue: true,
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
          edit: {
            props: {
              disabled: true,
            },
          },
        },
      ],
    },
  ],
}

export default pageConfig
