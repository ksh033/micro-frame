import React, { useCallback, useMemo } from 'react';
import { ScEditableTable } from '@scboson/sc-element';
import defaultRenderText, { cacheRender } from '../../Dict/defaultRender';
import userDictModel from '../../Dict/userDictModel';
import { EditableProTableProps } from '@scboson/sc-element/es/sc-editable-table';
import { Key } from 'antd/es/table/interface';
import { FormInstance } from 'antd/es/form/Form';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import Form from 'antd/es/form';
import { ActionRenderFunction } from '@scboson/sc-element/es/sc-editable-table/typing';
import style from './index.less';

export interface BsEditTableProps extends EditableProTableProps<any> {
  type?: 'multiple' | 'single';
  editableKeys?: Key[];
  setEditableRowKeys?: (editableKeys: Key[], editableRows: any) => void;
  innerForm?: FormInstance<any>;
  actionRender?: ActionRenderFunction<any> | undefined;
  preformatValue?: (list: any[]) => any[];
}

const BsEditTable: React.FC<BsEditTableProps> = (props: BsEditTableProps) => {
  const {
    columns = [],
    value,
    onChange,
    innerForm,
    readonly,
    editableKeys,
    setEditableRowKeys,
    type = 'multiple',
    showIndex = true,
    pagination = {},
    clickEdit = true,
    rowKey = 'rowIndex',
    scroll = { x: 'max-content', y: '600px' },
    actionRender = (row, config, defaultDoms) => {
      return [defaultDoms.delete];
    },
    preformatValue,
    ...restProps
  } = props;

  const [editableRowKey, setRowKeys] = useMergedState<Key[]>(
    () => editableKeys || [],
    {
      value: editableKeys,
      onChange: setEditableRowKeys,
    }
  );

  const { getDistList } = userDictModel();
  const [form] = Form.useForm(innerForm);

  const columnsFormat = (list: any[]) => {
    list.forEach((col: any, index: number) => {
      if (Array.isArray(col.children) && col.children.length > 0) {
        col.children = columnsFormat(col.children);
      }

      const list: any = getDistList({
        dictTypeCode: `${col.dataType || col.dataIndex}`,
      });
      if (!col.width) {
        col.width = 150;
      }

      if (list && !col.render) {
        col.render = (text: string) => {
          return cacheRender(text, list);
        };
      } else if (col.dataType && !col.render) {
        col.render = (text: string, record: any) => {
          return defaultRenderText(text, col.dataType || col.dataIndex, record);
        };
      }
    });

    return list;
  };

  const newColumns = columnsFormat(columns);

  const handleChange = (recordList: any[]) => {
    let newList = recordList;
    if (preformatValue) {
      newList = preformatValue(recordList);
    }
    onChange?.(newList);
  };

  const editable = useMemo(() => {
    return {
      form: form,
      type: type,
      editableKeys: editableRowKey,
      onChange: setRowKeys,
      actionRender: actionRender,
    };
  }, [type, editableRowKey, setRowKeys, form]);

  return (
    <div className={style['bs-edit-table']}>
      <ScEditableTable
        columns={newColumns}
        value={value}
        onChange={handleChange}
        rowKey={rowKey}
        clickEdit={clickEdit}
        pagination={pagination}
        showIndex={showIndex}
        scroll={scroll}
        readonly={readonly}
        editable={editable}
        {...restProps}
      />
    </div>
  );
};

export default BsEditTable;
