import { QuestionCircleFilled } from '@ant-design/icons';
import type { PageConfig } from '@scboson/sc-schema';
import type TableInfo from '@scboson/sc-schema/lib/page/TableInfo';
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
  WithTableProps & {
    viewUrl?: string;
    help?: string;
    formatTableInfo?: (tableInfo: TableInfo) => TableInfo;
  }
>(GoodsCenterTable, pageConfig, (props, searchInfo, pagetInfo) => {
  const { viewUrl, help, formatTableInfo, ...restProps } = props;

  pagetInfo.changeCol('saleModel', {
    render: (value, record, index) => {
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
    .changeSearchItem('goodsSearchKey', {
      width: 630,
    })
    .toConfig();
  return {
    //request: defaultReq,
    rowKey: 'goodsId',
    ...restProps,
    bordered: false,
    size: 'small',
    pageSize: 5,
    //pagination: { pageSize: 5, pageSizeOptions: [5, 10, 20], current: 1 },
    scroll: { y: 500, x: 560 },
  };
});
