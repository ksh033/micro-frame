import list from "./list";
import type { PageConfig } from "@scboson/sc-schema";
import { openWindow } from "../../../Auth";
import { WithTable, WithTableProps } from "../../../WithComponent";
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
GoodsCenterTable.displayName = "GoodsCenterTable";

/** 商品表格 */
export default WithTable<WithTableProps & { viewUrl?: string }>(
  GoodsCenterTable,
  pageConfig,
  (props, searchInfo, pagetInfo) => {
    const { viewUrl, ...restProps } = props;
    pagetInfo.changeCol("saleModel", {
      render: (value, record, index) => {
        const { saleUnit } = record;
        //if (params.)
        //const [value,record,index,dictText]=
        return `${saleUnit}(${value})`;
      },
    });
    pagetInfo.changeCol("goodsName", {
      props: {
        onClick: viewUrl
          ? (record: any) => {
              const key = props["rowKey"] || "dataId";
              openWindow(`${viewUrl}` + record[key]);
            }
          : undefined,
      },
    });

    searchInfo
      .changeSearchItem("goodsSearchKey", {
        width: 630,
      })
      .toConfig();
    return {
      //request: defaultReq,
      ...restProps,
      bordered: false,
      size: "small",
      rowKey: "goodsId",
      pageSize: 5,
      //pagination: { pageSize: 5, pageSizeOptions: [5, 10, 20], current: 1 },
      scroll: { y: 420, x: 560 },
    };
  }
);
