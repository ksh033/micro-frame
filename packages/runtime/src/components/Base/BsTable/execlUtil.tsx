import { genColumnKey } from '@scboson/sc-element/es/sc-table/utils';
import { ExportExeclConfig } from './index';

const execlColumnsFormat = (
  list: any[],
  map: Record<string, any>,
  exportExeclConfig: ExportExeclConfig
) => {
  const newList = list
    .map((col: any, index: number) => {
      if (col.dataIndex.startsWith('_')) {
        return false;
      }
      const columnKey = genColumnKey(col.dataIndex, index);
      const config = map[columnKey];
      if (config == null) {
        return false;
      }
      if (config && config.show === false) {
        return false;
      }
      let column: any = {
        field: col.dataIndex,
        text: col.title,
      };
      if (
        col.dataType &&
        (col.dataType === 'money' || col.dataType === 'unitprice')
      ) {
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
        }
        if (typeof column.width === 'number') {
          width = column.width;
        }
        if (width != null) {
          column.width = width;
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
