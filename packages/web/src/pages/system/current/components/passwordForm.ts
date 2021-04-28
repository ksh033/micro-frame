import type { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  formConfig: [
    {
      col: 1,
      fieldset: 'basic',
      fieldsetTitle: '',
      items: [
        {
          label: '旧密码',
          name: 'oldPwd',
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
            type: 'password',
            placeholder: '请输入旧密码',
          },
        },
        {
          label: '新密码',
          name: 'newPwd',
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
            type: 'password',
            placeholder: '请输入新密码',
          },
        },
        {
          label: '确认密码',
          name: 'confirmPwd',
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
            type: 'password',
            placeholder: '请输入确认密码',
          },
        },
      ],
    },
  ],
}

export default pageConfig
