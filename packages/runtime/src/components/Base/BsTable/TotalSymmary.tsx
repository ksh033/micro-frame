/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yangyuhang
 * @Date: 2023-01-05 10:01:22
 * @LastEditors: yangyuhang
 * @LastEditTime: 2023-06-12 10:12:50
 */
import defaultRender from '../../Dict/defaultRender';
import { ScProColumn, ScProColumnType } from '@scboson/sc-element/es/sc-table';
import { Table } from 'antd';
import React from 'react';
import { ScProColumnGroupType } from '@scboson/sc-element/es/sc-table/typing';

export type SymmaryProColumnType = ScProColumnType<any> & {
  dataType?: string;
};

export type TotalSymmaryProps = {
  /** @name table 列属性 */
  columns?: SymmaryProColumnType[];
  /** 统计的数值 */
  recordSummary?: any[];
};

export function digColumns(columns: ScProColumn<any>, list: any): SymmaryProColumnType[] {
  if (Array.isArray(columns)) {
    columns.forEach((it) => {
      const item = it as ScProColumnGroupType<any>;
      if (!item.hidden) {
        if (Array.isArray(item.children)) {
          list.concat(digColumns(item.children, list));
        } else {
          list.push(item);
        }
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
      {recordSummary && Array.isArray(recordSummary) &&
        recordSummary.map((totalData: any, idx) => {
          if (!totalData) {
            return null
          }
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
