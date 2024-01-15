import { genColumnKey } from "@scboson/sc-element/es/sc-table/utils";


import { ExportExeclConfig } from "./index";
import { ProColumns } from "@scboson/sc-schema";



const execlColumnsFormat = (
  list: any[],
  map: Record<string, any>,
  exportExeclConfig: ExportExeclConfig
) => {
  const newList = list
    .map((col, index: number) => {

      const { dataIndex, children } = col as any
      //去除操作列
      if (dataIndex === "_OperateKey") {
        return false;
      }
      const columnKey = genColumnKey(dataIndex, index);
      const config = map[columnKey];
      if (col.exportConfig === false) {
        return false;
      }
      // if (config == null) {
      //   return false;
      // }
      if (config && config.show === false) {
        return false;
      }
      let column: any = {};
      if (col.exportConfig) {
        if (typeof col.exportConfig === "boolean") {
          column = {
            field: dataIndex,
            text: col.title,
            width: col.width, //((col.width && col.width !== "auto" ? col.width : 180) - 5) / 6
          };
        } else {
          column = {
            field: col.exportConfig.dataIndex || dataIndex,
            text: col.exportConfig.name || col.title,
            width: col.width, //((col.width && col.width !== "auto" ? col.width : 180) - 5) / 6
          };
        }
      } else {
        column = {
          field: dataIndex,
          text: col.title,
          width: col.width, //((col.width && col.width !== "auto" ? col.width : 180) - 5) / 6
        };
      }

      if (
        col.dataType &&
        (col.dataType === "money" || col.dataType === "unitprice")
      ) {
        if (col.dataType === "money") {
          column.pattern = "#,##0.00";
        }
        if (col.dataType === "unitprice") {
          column.pattern = "#,##0.0000";
        }
        column.dataType = "CURRENCY";
      }
      if (column.width != null) {
        let width: number | null = null;
        if (typeof column.width === "string") {
          if (column.width.indexOf("%") != -1) {
            width = 180;
          }
          if (column.width.indexOf("px") != -1) {
            width = column.width.replace("px", "");
          }
          if (column.width === "auto") {
            width = 180;
          }
        }

        if (typeof column.width === "number") {
          width = column.width;
        }
        if (width != null) {
          column.width = Math.ceil((width - 5) / 6);
          if (column.width > 255) {
            column.width = 255;
          }
        }
      }
      if (Array.isArray(exportExeclConfig.excelColumn)) {
        const item = exportExeclConfig.excelColumn.find(
          (it) => it.field === column.field
        );
        if (item) {
          column = Object.assign({}, column, item);
        }
      }
      if (Array.isArray(children) && children.length > 0) {
        column.children = execlColumnsFormat(
          children,
          map,
          exportExeclConfig
        );
      }
      return column;
    })
    .filter(Boolean);

  return newList;
};

export { execlColumnsFormat };
