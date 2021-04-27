import type { PageConfig } from "@scboson/sc-schema";

const pageConfig: PageConfig = {
  formConfig: [
 {
      col: 2,
      fieldset: "basic",
      fieldsetTitle: "",
      items: [
        {
          label: "所属应用",
          name: "systemCode",
          component: "ScSelect",
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            request:'',
            placeholder: "请输所属应用",
            textField:'systemName',
            valueField:'systemCode'
          },
        },
        {
          label: "所属机构",
          name: "bizDeptId",
          component: "ScSelect",
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
            textField:'bizDeptName',
            valueField:'bizDeptId'
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
          label: "用户姓名",
          name: "realName",
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
          label: "角色授权",
          name: "sysRoleList",
          component: "ScSelect",
          formItemProps: {
            required: true,
            rules: [
              {
                required: true,
              },
            ],
          },
          props: {
            placeholder: "角色授权",
            textField:'roleName',
            valueField:'roleId',
            data:[]
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
          title:'',
          label: "备注",
          name: "sysRoleList1",
          component: "Input",
          colProps:{
            span:24,
          },
        
          props: {
            placeholder: "备注",
          },
        },
      ],
    },
  ],
};

export default pageConfig;
