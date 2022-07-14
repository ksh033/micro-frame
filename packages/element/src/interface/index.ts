import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import React from 'react';
import ParentSchemCmp from '../base/ParentSchemCmp';
import { ComponentItemType } from './enum';

// 组件展示基础信息
export interface CmpInfo {
  type?: string | Array<string>;
  name: string;
  description?: string;
  cmpKey: string;
  icon?: string;
  maxNum: number;
  usedNum: number;
  status: string;
}

export type VdProFormColumnsType<RecordType = any> = ProFormColumnsType<
  RecordType,
  ComponentItemType
>;

export interface Mixin {
  onFilter?: (
    columns: ProFormColumnsType[],
    fn: (item: ProFormColumnsType) => boolean,
  ) => ProFormColumnsType[];
  inCluded?: (columns: ProFormColumnsType[], list: React.Key[]) => boolean;
  getFieldsValue: () => any;
  setFieldsValue: (record: any) => void;
  setImmediatelyCheck: (checked: boolean) => void;
}
/**
 * 组件配置的数据结构
 */
export interface ComponentSchemaType {
  id: string;
  values: any;
  immediatelyCheck: boolean; // 加载组件的时候是否立即校验
  cmpKey: string; // 映射组件用的
  cmpName?: string;
  propsConfig: VdProFormColumnsType<any>[]; // 右侧属性配置栏显示
  getInitialValue?: () => any; // 右侧属性初始化数据
  getPropsConfig?: (
    columns: ProFormColumnsType[],
    record: any,
  ) => ProFormColumnsType[];
  render?: (
    props: any,
  ) => React.ReactNode | React.ReactElement<any, any> | null;
  onValuesChange?: (changedValues: any, allValues: any) => any;
  formatValues?: (allValues: any) => void;
  initClass: (record: ComponentSchemaType) => void;
}

export type ClassType = typeof ParentSchemCmp;

export type ComponentSchemaProps = ComponentSchemaType & Mixin;

// 组件分组
export interface CompsClassGroup {
  id: string;
  name: string;
  list: ClassType[];
}

export interface CompsGroup {
  id: string;
  name: string;
  list: CmpInfo[];
}
