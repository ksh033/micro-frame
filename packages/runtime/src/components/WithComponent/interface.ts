import type { BsEditTableProps } from '@/components/Base/BsEditTable';
import type { BsTableProps } from '@/components/Base/BsTable';
import type { CheckboxProps } from 'antd';
//import type { RowSelectionType } from 'antd/es/table/interface';
import type { FormSearchItem, ProColumn } from '@scboson/sc-schema/es/interface';
import type { ScSelectProps } from '@scboson/sc-element/es/sc-select';
import type { MutableRefObject } from 'react';

export type WithTableProps = {
  extraColumns?: ProColumn[];
  extraQueryColumns?: FormSearchItem[];
  selectionType?: 'checkbox' | 'radio';
  onTabelRow?: (selectedRowKeys: string[], selectedRows: any[]) => void;
  ref?: React.Ref<any>;
  children?: any;

  formatPrams?: (params: any) => any;
  getCheckboxProps?: (record: any) => Partial<Omit<CheckboxProps, 'defaultChecked' | 'checked'>>;
} & BsTableProps;


// eslint-disable-next-line @typescript-eslint/ban-types
export type WithSelectProps = {

} & ScSelectProps
export type WithSelectTableProps = {
  /**
   * 显示类型
   */
  type?: 'select' | 'table';
  buttonText?: string;

  /*
   * 选择中的表格数据转业务数据
   */
  getValueProps?: (rowDatas: any) => any;
  /**
   *业务数据转表格数据
   */
  normalize?: (value: any) => any;
  /**
   *  选择框确认事件
   */
  onOk?: (selecteds?: any[]) => any;
  textPropName?: string;
  // valuePropName?: string;
  value?: any;

  /**
   * 表单onChange
   */
  onChange?: any;
  /**
   * 选中表格属性
   */
  tableProps?: BsEditTableProps;
  className?: string;
  /**
   * 选择行
   */
  selectedRows?: any[];
  dataRef?: MutableRefObject<{ selectedRows?: any[]; selectedKeys?: any[] }>;
  disabled?: boolean;
  readonly?: boolean;
  //valueFieldKeyMap: Record<string, string>;
};
