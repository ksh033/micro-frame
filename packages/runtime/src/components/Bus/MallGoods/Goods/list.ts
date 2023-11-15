import type { PageConfig } from '@scboson/sc-schema';

const pageConfig: PageConfig = {
  queryConfig: [
    {
      label: '商品搜索',
      name: 'goodsSearchKey',
      component: 'Input',
      props: {
        placeholder: '请输入商品名称/编码查询',
      },
    },
  ],
  tableConfig: [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      component: 'FieldImageName',
      props: {
        fieldName: 'goodsName',
        fieldImage: 'goodsThumb',
      },
      width: 170,
      ellipsis: true,
    },

    {
      title: '销售单位',
      align: 'center',
      dataIndex: 'saleModel',
      width: 80,
    },
    {
      title: '品牌',
      align: 'center',
      dataIndex: 'brandName',
      width: 80,
    },
    {
      title: '商品类型',
      align: 'center',
      dataIndex: 'goodsType',
      width: 80,
    },
    {
      title: '档口',
      align: 'center',
      dataIndex: 'goodsStallType',
      width: 80,
    }
    // ,
    // {
    //   title: '关联商品',
    //   align: 'center',
    //   dataIndex: 'cargoList',
    //   ellipsis: true,
    //   width: 100,
    // },
  ],
};
export default pageConfig;
