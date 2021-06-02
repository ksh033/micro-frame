import type { PageConfig } from '@scboson/sc-schema'

const pageConfig: PageConfig = {
  queryConfig: {
    cooperateSupplier: [
      {
        label: '供应商名称',
        name: 'supplierName',
        component: 'Input',
      },
      {
        label: '供应商类型',
        name: 'supplierType',
        component: 'DictSelect',
        props: {
          dictType: 'supplierType',
          placeholder: '请选择供应商类型',
        },
      },
    ],
    supplier: [
      {
        label: '供应商名称',
        name: 'supplierCodeName',
        component: 'Input',
      },
      {
        label: '供应商类型',
        name: 'supplierType',
        component: 'DictSelect',
        props: {
          dictType: 'supplierType',
          placeholder: '请选择供应商类型',
        },
      },
    ],
  },
  tableConfig: [
    {
      title: '供应商编码',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '供应商类型',
      dataIndex: 'supplierType',
      key: 'supplierType',
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'socialLicenceNo',
      key: 'socialLicenceNo',
    },
  ],
}
export default pageConfig
