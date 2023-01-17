import { genColumnKey } from '@scboson/sc-element/es/sc-table/utils';
import { ProColumn } from '@scboson/sc-schema/es/interface';

import { ExportExeclConfig } from './index';

const execlColumnsFormat = (
  list: any[],
  map: Record<string, any>,
  exportExeclConfig: ExportExeclConfig
) => {
  const newList = list
    .map((col: ProColumn, index: number) => {
      const columnKey = genColumnKey(col.dataIndex, index);


      const config = map[columnKey];


      if (col.exportConfig && col.exportConfig?.export === false) {
        return false;
      }
      // if (config == null) {
      //   return false;
      // }
      if (config && config.show === false) {
        return false;
      }
      let column: any = {}
      if (col.exportConfig) {
        column = {
          field: col.exportConfig.dataIndex || col.dataIndex,
          text: col.exportConfig.name || col.title,
          width: col.width//((col.width && col.width !== "auto" ? col.width : 180) - 5) / 6
        };
      } else {
        column = {
          field: col.dataIndex,
          text: col.title,
          width: col.width//((col.width && col.width !== "auto" ? col.width : 180) - 5) / 6
        };
      }

      if (
        col.dataType &&
        (col.dataType === 'money' || col.dataType === 'unitprice')
      ) {
        if (col.dataType === 'money') {
          column.pattern = "#,##0.00"
        }
        if (col.dataType === 'unitprice') {
          column.pattern = "#,##0.0000"
        }
        column.dataType = 'CURRENCY';
      }
      if (column.width != null) {
        let width: number | null = null;
        if (typeof column.width === 'string') {
          if (column.width.indexOf('%') != -1) {
            width = 180;
          }
          if (column.width.indexOf('px') != -1) {
            width = column.width.replace('px', '');
          }
          if (column.width === "auto") {
            width = 180;
          }
        }

        if (typeof column.width === 'number') {
          width = column.width;
        }
        if (width != null) {
          column.width = ((width - 5) / 6);
          if (column.width > 255) {
            column.width = 255
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
      if (Array.isArray(col.children) && col.children.length > 0) {
        column.children = execlColumnsFormat(
          col.children,
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
