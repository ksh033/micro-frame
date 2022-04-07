import { ProFormColumnsType } from '@ant-design/pro-form';

import { ReactNode, ReactElement } from 'react';
import {
  CmpInfo,
  ComponentSchemaType,
  Mixin,
  VdProFormColumnsType,
} from '../interface';
import { genNonDuplicateId } from '../utils';

class ParentSchemCmp implements ComponentSchemaType, Mixin {
  // 基础配置
  static info: CmpInfo = {
    name: '',
    maxNum: 0,
    usedNum: 0,
    status: 'success',
    cmpKey: 'ParentSchemCmp',
  };

  propsConfig: VdProFormColumnsType[] = [];
  cmpKey: string = '';
  cmpName: string = '';
  id: string = '';
  values = {};
  immediatelyCheck: boolean = false;

  constructor() {
    this.id = genNonDuplicateId();
  }

  [key: string]: any;

  getInitialValue?(): any;
  getPropsConfig?(
    columns: ProFormColumnsType[],
    record: any,
  ): ProFormColumnsType[];
  render?(props: any): ReactNode | ReactElement<any, any>;
  onValuesChange?(changedValues: any, allValues: any): any;

  onFilter(
    columns: ProFormColumnsType[],
    fn: (item: ProFormColumnsType) => boolean,
  ) {
    return columns.filter(fn);
  }

  getFieldsValue() {
    return this.values;
  }
  setFieldsValue(record: any) {
    if (Object.prototype.toString.call(record) === '[object Object]') {
      this.values = {
        ...this.values,
        ...record,
      };
    }
  }
  setImmediatelyCheck(check: boolean) {
    this.immediatelyCheck = check;
  }

  initClass(record: ComponentSchemaType) {
    this.id = record.id;
    this.immediatelyCheck = record.immediatelyCheck;
    this.values = record.values;
  }
}

export default ParentSchemCmp;
