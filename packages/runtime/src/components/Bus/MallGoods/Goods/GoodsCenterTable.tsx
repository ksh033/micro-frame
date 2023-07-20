/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yangyuhang
 * @Date: 2023-02-16 15:28:26
 * @LastEditors: yangyuhang
 * @LastEditTime: 2023-07-20 16:17:17
 */
import { QuestionCircleFilled } from '@ant-design/icons';
import type { PageConfig } from '@scboson/sc-schema';
import { openWindow } from '../../../Auth';
import { WithTable, WithTableProps } from '../../../WithComponent';

import list from './list';
const pageConfig: PageConfig = {
  service: {},
  ...list,
};

//const defaultReq = getServiceApi('pageconfig', 'queryPage');

/**
 * @param props 通用商品选择表格
 * @returns
 */
const GoodsCenterTable: React.FC<WithTableProps> = (props: any) => {
  const { children } = props;
  return <> {children}</>;
};
GoodsCenterTable.displayName = 'GoodsCenterTable';

/** 商品表格 */

export default WithTable<
  any
>(GoodsCenterTable, pageConfig, (props, searchInfo, pagetInfo) => {
  const { viewUrl, help, formatTableInfo, columns, ...restProps } = props;

  pagetInfo.changeCol('saleModel', {
    render: (value, record) => {
      const { saleUnit } = record;
      //if (params.)
      //const [value,record,index,dictText]=
      return `${saleUnit}(${value})`;
    },
  });
  pagetInfo.changeCol('goodsName', {
    width: 200,
    props: {
      title: help ? (
        <span>
          商品名称<QuestionCircleFilled></QuestionCircleFilled>
        </span>
      ) : (
        '商品名称	'
      ),
      onClick: viewUrl
        ? (record: any) => {
          const key = props['rowKey'] || 'dataId';
          openWindow(`${viewUrl}` + record[key]);
        }
        : undefined,
    },
  });

  if (formatTableInfo) {
    pagetInfo = formatTableInfo(pagetInfo);
  }

  searchInfo
    // .changeSearchItem('goodsSearchKey', {
    //   width: 630,
    // })
    .toConfig();
  return {
    //request: defaultReq,
    rowKey: 'goodsId',
    columns: columns || pagetInfo.tableInfo.columns,
    ...restProps,
    bordered: false,
    size: 'small',
    pageSize: 5,
    //pagination: { pageSize: 5, pageSizeOptions: [5, 10, 20], current: 1 },
    scroll: { y: 400, x: 560 },
  };
});
