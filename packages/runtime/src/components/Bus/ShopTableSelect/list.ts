import type { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  queryConfig: [
    {
      label: '门店查询',
      name: 'shopCodeName',
      component: 'Input',
      props: {
        placeholder: '请输入名称/编码',
      },
    },
    {
      label: '门店类型',
      name: 'shopType',
      component: 'DictSelect',
      props: {
        sysCode: 'basesys',
        dictType: 'shopType',
        placeholder: '请选择门店类型',
      },
    },
  ],
  tableConfig: [
    {
      title: '门店编码',
      dataIndex: 'shopCode',
    },
    {
      title: '门店名称',
      dataIndex: 'shopName',
    },
    {
      title: '门店类型',
      dataIndex: 'shopType',
    },
    {
      title: '所属子公司',
      dataIndex: 'subcompanyName',
    },
    {
      title: '经营业务',
      dataIndex: 'shopBusiness',
      key: 'shopBusiness',
    },
  ],
}
export default pageConfig
