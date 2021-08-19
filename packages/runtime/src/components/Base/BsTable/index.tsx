/* eslint-disable no-param-reassign */
import React, { useMemo } from "react";
import { ScTable } from "@scboson/sc-element";
import type {
  ScTableProps,
  ColumnsType,
} from "@scboson/sc-element/es/sc-table/ScTable";
import defaultRenderText, { cacheRender } from "../../Dict/defaultRender";
import userDictModel from "../../Dict/userDictModel";
import ToolBar from "../ToolBar";
import Authority from "../../Auth/Authority";

import styles from "./index.less";
import { ToolBarProps } from "@scboson/sc-element/es/sc-table/components/ToolBar";

const { Operation } = ScTable;

export interface BsTableProps extends Omit<ScTableProps<any>, "columns"> {
  toolbar?: any[];
  sysCode?: string;
  columns?: ColumnsType<any> & {
    sysCode?: string;
  };
}
export interface BsTableComponentProps {
  dataIndex?: string;
  rowData?: any;
  value?: any;
}

const BsTable: React.FC<BsTableProps> = (props: BsTableProps) => {
  const {
    toolbar = [],
    columns = [],
    data,
    toolBarRender,
    onLoad,
    ...restProps
  } = props;

  const { getDistList } = userDictModel();

  const lastCol: any = columns[columns.length - 1];
  columns.forEach((col: any, index: number) => {
    const list: any = getDistList({
      syscode: col.sysCode,
      dictTypeCode: `${col.dataType || col.dataIndex}`,
    });
    if (!col.width) {
      col.width = 180;
    }
    // if (columns.length > 3) {
    //   if (lastCol.dataIndex !== '_OperateKey') {
    //     if (index === columns.length - 2) {
    //        col.width='auto'
    //     }
    //   } else {
    //     if (index === columns.length - 1) {
    //       delete col.width
    //     }
    //   }
    // }

    if (list && !col.render) {
      col.render = (text: string) => {
        return cacheRender(text, list);
      };
    } else if (col.dataType && !col.render) {
      col.render = (text: string, record: any) => {
        return defaultRenderText(text, col.dataType || col.dataIndex, record);
      };
    } else if (col.component && !col.render) {
      const comProps = col.props || {};
      col.render = (text: any, record: any) => {
        if (col.component.displayName&&col.component.displayName==="Enabled"){
          if (!comProps["funcode"])
          comProps["funcode"]="ENABLE"
        }
        const component =
          typeof col.component === "function"
            ? React.createElement(col.component, {
                rowData: record,
                dataIndex: col.dataIndex,
                value: text,
                ...comProps,
              })
            : React.cloneElement(col.component, {
                rowData: record,
                dataIndex: col.dataIndex,
                value: text,
                ...comProps,
              });
        return component;
      };
    }
    delete col.sysCode;
  });

  let newToolBarRender: any;

  let rtoolBarRender: any = () => {
    const hasToolBar = Array.isArray(toolbar) && toolbar.length > 0;
    const toolBarRender = hasToolBar
      ?  <ToolBar
            buttons={toolbar}
            className={styles["bs-table-toolbar-btn"]}
          ></ToolBar>
      : [];
    return toolBarRender;
  };
  if (toolBarRender === false) {
    newToolBarRender = false;
  } else {
    if (toolBarRender) {
      newToolBarRender = toolBarRender;
    } else {
      newToolBarRender = rtoolBarRender;
    }
  }
  const dataLoad = (data: any) => {
    let newData = {};
    if (data) {
      let rows = data.records || data.rows || [];
      const { current = 1, size = 10 } = data;
      rows = rows.map((item: any, index: number) => {
        const titem = item;
        titem.index = index + 1 + (current - 1) * size;
        return titem;
      });
      newData = {
        rows,
        total: data.total,
        current,
        size,
      };
    } else {
      newData = {
        total: 0,
        rows: [],
      };
    }

    onLoad && onLoad(newData);

    return newData;
  };
  return (
    <>
      <div className={"bs-table-list"}>
        <ScTable
          {...restProps}
          onLoad={dataLoad}
          data={data}
          columns={columns}
          toolBarRender={newToolBarRender}
        />
      </div>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
type BsTable = typeof BsTable;
interface Table extends BsTable {
  Operation: any;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Table: Table = BsTable as Table;
Table.Operation = Authority(Operation);

export default Table;
