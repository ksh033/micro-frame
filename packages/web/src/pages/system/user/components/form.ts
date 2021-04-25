import type { PageConfig } from "@scboson/sc-schema";

const pageConfig: PageConfig = {
  formConfig: [
    {
      col: 2,
      fieldset: "basic",
      fieldsetTitle: "sdfsdf",
      items: [
        {
          label: "所属应用",
          name: "systemCode",
          component: "Input",
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: "请输所属应用",
          },
        },
        {
          label: "所属机构",
          name: "bizDeptId",
          component: "Input",
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: "请输所属机构",
          },
        },
        {
          label: "用户姓名",
          name: "realName",
          component: "Input",
          required: true,
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: "请输所属应用",
          },
        },
        {
          label: "手机",
          name: "phone",
          component: "Input",
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: "请输手机",
          },
        },
        {
          label: "角色授权",
          name: "sysRoleList",
          component: "Input",
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: "请输手机",
          },
        },
        {
          label: "用户账号",
          name: "userName",
          component: "Input",
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: "请输手机",
          },
        },
        {
          label: "邮箱",
          name: "email",
          component: "Input",
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: "请输手机",
          },
        },
        {
          label: "备注",
          name: "sysRoleList1",
          component: "Input",
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: "请输手机",
          },
        },
      ],
    },
  ],
};

export default pageConfig;
