import defaultRender from '../../Dict/defaultRender';
import { ScProColumn, ScProColumnType } from '@scboson/sc-element/es/sc-table';
import { ScProColumnGroupType } from '@scboson/sc-element/es/sc-table/ScTable';
import { Table } from 'antd';
import React from 'react';

export type SymmaryProColumnType = ScProColumnType<any> & {
  dataType?: string;
};

export type TotalSymmaryProps = {
  /** @name table 列属性 */
  columns?: SymmaryProColumnType[];
  /** 统计的数值 */
  recordSummary?: any[];
};

export function digColumns(columns: ScProColumn<any>): SymmaryProColumnType[] {
  const list: SymmaryProColumnType[] = [];
  if (Array.isArray(columns)) {
    columns.forEach((it) => {
      const item = it as ScProColumnGroupType<any>;
      if (Array.isArray(item.children)) {
        list.concat(digColumns(item.children));
      } else {
        list.push(item);
      }
    });
  }
  return list;
}

export const spellNamePath = (
  dataIndex: React.Key | React.Key[] | any
): React.Key[] => {
  if (Array.isArray(dataIndex)) {
    return [...dataIndex];
  }
  return [dataIndex];
};

const TotalSymmary: React.FC<TotalSymmaryProps> = (props) => {
  const { columns = [], recordSummary = [] } = props;

  return (
    <>
      {Array.isArray(recordSummary) &&
        recordSummary.map((totalData: any, idx) => {
          return (
            <Table.Summary.Row key={`summary-${idx}`}>
              {columns.map((item, index) => {
                const cellProps: any = {
                  align: item.align,
                };
                let itemValue: any = null;
                const dataIndex = spellNamePath(item.dataIndex).join('-');
                if (dataIndex) {
                  itemValue = totalData[dataIndex];
                }
                if (itemValue == null && index === 0) {
                  itemValue = '合计';
                }

                if (item.dataType) {
                  if (
                    item.dataType === 'money' ||
                    item.dataType === 'unitprice'
                  ) {
                    cellProps.align = 'right';
                  }
                  if (itemValue != null) {
                    itemValue = defaultRender(itemValue, item.dataType);
                  }
                }
                return (
                  <Table.Summary.Cell
                    index={index}
                    key={item.dataIndex}
                    colSpan={1}
                    {...cellProps}
                  >
                    {itemValue}
                  </Table.Summary.Cell>
                );
              })}
            </Table.Summary.Row>
          );
        })}
    </>
  );
};

export default TotalSymmary;
