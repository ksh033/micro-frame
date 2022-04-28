import type { PageConfig } from "@scboson/sc-schema";

const pageConfig: PageConfig = {
  queryConfig: [
    {
      label: "商品搜索",
      name: "goodsSearchKey",
      component: "Input",
      props: {
        placeholder: "支持名称/简称/速记码/编码查询",
      },
    },
  ],
  tableConfig: [
    {
      title: "商品名称",
      dataIndex: "goodsName",
      component: "FieldImageName",

      props: {
        fieldName: "goodsName",
        fieldImage: "goodsThumb",
      },

      width: 180,
    },

    {
      title: "销售单位",
      align: "center",
      dataIndex: "saleModel",
      width: 80,
    },
    {
      title: "品牌",
      align: "center",
      dataIndex: "brandName",
      width: 80,
    },
    {
      title: "商品类型",
      align: "center",
      dataIndex: "goodsType",
      width: 80,
    },
    {
      title: "关联货品",
      align: "center",
      dataIndex: "cargoList",
      width: 180,
    },
  ],
};
export default pageConfig;