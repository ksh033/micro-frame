import type { PageConfig } from '@scboson/sc-schema';

const pageConfig: PageConfig = {
  queryConfig: [
    {
      label: '品目名称',
      name: 'catalogName',
      component: 'Input',
      props: {
        placeholder: '输入名称/编码/助记码',
      },
    },
  ],
  tableConfig: [
    {
      title: '品目名称',
      dataIndex: 'catalogName',
      fixed: false,
      width: 120,
    },
    {
      title: '品目编码',
      dataIndex: 'catalogCode',
      fixed: false,
      width: 120,
    },
  ],
};
export default pageConfig;
