import { ProFormColumnsType } from '@ant-design/pro-form';
import { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';

import { ReactNode, ReactElement } from 'react';
import {
  CmpInfo,
  ComponentSchemaType,
  Mixin,
  VdProFormColumnsType,
} from '../interface';
import { genNonDuplicateId } from '../utils';

export type FormProps = Omit<FormSchema<any, any>, 'layoutType' | 'columns'>;

class ParentSchemCmp implements ComponentSchemaType, Mixin {
  // 基础配置
  static info: CmpInfo = {
    name: '',
    maxNum: 0,
    usedNum: 0,
    status: 'success',
    cmpKey: 'ParentSchemCmp',
  };
  formProps: FormProps = {};

  propsConfig: VdProFormColumnsType[] = [];
  cmpKey: string = '';
  cmpName: string = '';
  id: string = '';
  values: any = {};
  immediatelyCheck: boolean = false;

  constructor(values = {}) {
    this.values = values;
    this.id = genNonDuplicateId();
  }

  [key: string]: any;

  getInitialValue?(): any;
  getPropsConfig?(
    columns: ProFormColumnsType[],
    record: any
  ): ProFormColumnsType[];
  render?(props: any): ReactNode | ReactElement<any, any>;
  onValuesChange?(changedValues: any, allValues: any): any;

  onFilter(
    columns: ProFormColumnsType[],
    fn: (item: ProFormColumnsType) => boolean
  ) {
    return columns.filter(fn);
  }

  setId(id: string) {
    this.id = id;
  }

  getFieldsValue() {
    return this.values;
  }
  setFieldsValue(record: any) {
    if (Object.prototype.toString.call(record) === '[object Object]') {
      this.values = record;
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
