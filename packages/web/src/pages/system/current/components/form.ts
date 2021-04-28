import type { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  formConfig: [
    {
      col: 1,
      fieldset: 'basic',
      fieldsetTitle: '',
      items: [
        {
          label: '操作员姓名',
          name: 'realName',
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
          fieldProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            disabled: true,
            placeholder: '请输入手机',
          },
        },
        {
          label: '邮箱',
          name: 'email',
          component: 'Input',
          fieldProps: {
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
      ],
    },
  ],
}

export default pageConfig
