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
      if (col.dataType && col.dataType === 'money') {
        column.dataType = 'CURRENCY';
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
