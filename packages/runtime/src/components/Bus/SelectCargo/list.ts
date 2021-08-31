import type { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  queryConfig: [
    {
      label: '货品查询',
      name: 'cargoCodeName',
      component: 'Input',
      props: {
        placeholder: '请输入货品名称/编码',
      },
    },
  ],
  tableConfig: [
    {
      title: '货品编码',
      dataIndex: 'cargoCode',
      key: 'cargoCode',
      width: 100,
    },
    {
      title: '货品名称',
      dataIndex: 'cargoName',
      component: 'FieldImageName',
      props: {
        fieldName: 'cargoName',
        fieldImage: 'cargoIconUrl',
      },
      width: 120,
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: '规格',
      dataIndex: 'standards',
      key: 'standards',
    },
  ],
}
export default pageConfig
