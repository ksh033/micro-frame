/* eslint-disable max-len */

import React, { useRef } from 'react';
import { Input, Select, Button } from 'antd';
import { CModal } from '@scboson/sc-element';
import TableModal from './table';
import {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form';
import { TableRowSelection } from 'antd/es/table/interface';

interface TableSelectProps extends FormComponentProps {
  placeholder?: string;
  value?: any;
  title?: string;
  onChange?: (value: any) => void;
  selectionType?: 'checkbox' | 'radio';
  textField?: any;
  disabled: boolean;
  valueField?: string;
  rowSelection?: TableRowSelection<any>;
  needAll?: boolean; // 是否需要查询组织底下所有仓库
}

const WarehouseTableSelect: FormComponent<TableSelectProps> = (
  props: TableSelectProps
) => {
  const {
    placeholder = '请选择仓库',
    title = '选择',
    selectionType = 'radio',
    rowSelection,
    onChange,
    value = [],
    disabled = false,
    textField = 'warehouseName',
    valueField = 'warehouseId',
    readonly,
    form,
    needAll = true,
    ...resProps
  } = props;

  const stateRef = useRef<any>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  if (Array.isArray(value)) {
    stateRef.current = {
      selectedRowKeys: value.map((item) => item[`${valueField}`]),
      selectedRows: value,
    };
  }

  const onTabelRow = (selectedRowKeys: any[], selectedRows: any[]) => {
    stateRef.current = {
      selectedRowKeys,
      selectedRows,
    };
  };

  const formatSelectValue = (list: any[]) => {
    if (Array.isArray(list) && list.length > 0) {
      const values = list.map((item: any) => {
        return {
          value: item[valueField],
          label: item[textField],
          item,
        };
      });
      return values;
    }
    return [];
  };

  const handleClick = () => {
    CModal.show({
      title,
      width: '1200px',
      content: TableModal,
      pageProps: {
        rowSelection,
        onTabelRow,
        selectionType,
        needAll,
        rowKey: valueField,
        ...stateRef.current,
      },
      onOk: async () => {
        onChange?.(stateRef.current.selectedRows);
      },
    });
  };

  const handleChange = (e: any[]) => {
    let selectedRowKeys: any[] = [];
    if (Array.isArray(e) && e.length > 0) {
      selectedRowKeys = e.map((item, index) => {
        return item.value || index;
      });
    }

    let selectedRows: any[] = [];
    if (
      Array.isArray(stateRef.current.selectedRows) &&
      stateRef.current.selectedRows.length > 0 &&
      selectedRowKeys.length > 0
    ) {
      selectedRows = stateRef.current.selectedRows.filter((item: any) => {
        return item[valueField].includes(selectedRowKeys);
      });
    }

    stateRef.current = {
      selectedRowKeys,
      selectedRows,
    };
    onChange?.(selectedRows);
  };

  const formatInputValue = (list: any[]) => {
    if (Array.isArray(list) && list.length === 1) {
      const values = list[0][textField] || '';
      return values;
    }
    return '';
  };
  if (readonly === true) {
    return <span>{formatInputValue(value)}</span>;
  }

  if (selectionType === 'checkbox') {
    return (
      <Input.Group>
        <Select
          mode="multiple"
          placeholder={placeholder}
          value={formatSelectValue(value)}
          style={{ width: '70%' }}
          labelInValue
          open={false}
          onChange={handleChange}
          {...resProps}
          disabled={disabled}
        ></Select>
        <Button disabled={disabled} onClick={handleClick}>
          选择
        </Button>
      </Input.Group>
    );
  }
  return (
    <Input.Group>
      <Input
        placeholder={placeholder}
        value={formatInputValue(value)}
        readOnly
        disabled={disabled}
        addonAfter={
          <Button
            disabled={disabled}
            size="small"
            type="link"
            onClick={handleClick}
          >
            选择
          </Button>
        }
        {...resProps}
      />
    </Input.Group>
  );
};
WarehouseTableSelect.customView = true;
export default WarehouseTableSelect;
