import type { PageConfig } from "@scboson/sc-schema";

const pageConfig: PageConfig = {
  queryConfig: [
    {
      label: "仓库查询",
      name: "warehouseCodeName",
      component: "Input",
      props: {
        placeholder: "请输入名称/编码",
      },
    },
  ],
  tableConfig: [
    {
      title: "仓库编码",
      dataIndex: "warehouseCode",
    },
    {
      title: "仓库名称",
      dataIndex: "warehouseName",
    },
    {
      title: "所属公司",
      dataIndex: "companyName",
    },
    {
      title: "地址",
      dataIndex: "detailAddress",
    },
  ],
};
export default pageConfig;
