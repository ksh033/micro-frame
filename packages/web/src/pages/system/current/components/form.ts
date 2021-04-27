import type { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  formConfig: [
    {
      col: 2,
      fieldset: 'basic',
      fieldsetTitle: '',
      items: [
        {
          label: '当前用户id',
          name: 'bizDeptUserId',
          component: 'Input',
          hidden: true,
        },
        {
          label: '操作员账号',
          name: 'systemCode',
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
            placeholder: '请输入操作员账号',
          },
        },
        {
          label: '操作员姓名',
          name: 'bizDeptId',
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
            placeholder: '请输入操作员姓名',
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
            placeholder: '请输入手机',
          },
          edit: {
            props: {
              disabled: true,
            },
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
