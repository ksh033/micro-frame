import type { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  queryConfig: [
    {
      label: '商品查询',
      name: 'cargoCodeName',
      component: 'Input',
      props: {
        placeholder: '请输入商品名称/编码',
      },
    },
  ],
  tableConfig: [
    {
      title: '商品编码',
      dataIndex: 'cargoCode',
      key: 'cargoCode',
      width: 100,
    },
    {
      title: '商品名称',
      dataIndex: 'cargoName',
      component: 'FieldImageName',
      props: {
        fieldName: 'cargoName',
        fieldImage: 'cargoIconUrl',
      },
      width: 200,
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
      width: 80,
    },
    {
      title: '规格',
      dataIndex: 'standards',
      key: 'standards',
      width: 80,
    },
  ],
}
export default pageConfig
