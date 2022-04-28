/* eslint-disable react-hooks/exhaustive-deps */
import type { ComponentType} from 'react';
import React, { useMemo, useRef } from 'react';

import type { PageConfig} from '@scboson/sc-schema';
import { ListPage, useListPageContext } from '@scboson/sc-schema';

import { ScCard } from '@scboson/sc-layout'
import BsTable from '../Base/BsTable'
import BsSearch from '../Base/BsSearch'

import { Alert } from 'antd';
import type { WithTableProps } from './interface';
import isFunction from 'lodash/isFunction';
import type {ProColumn, FormSearchItem } from '@scboson/sc-schema/es/interface';

import { useUpdate } from 'ahooks';
import TableInfo from '@scboson/sc-schema/lib/page/TableInfo';
import SearchInfo from '@scboson/sc-schema/lib/page/SearchInfo';



export default function WithTable<P extends WithTableProps>(
  Component: React.ComponentType<any>,
  pageConfig: PageConfig,
  extProps?: P | ((p: P,searchInfo: SearchInfo,pagetInfo: TableInfo) => P),
): ComponentType<P> {
  const Cmp = (p: P) => {
    const update = useUpdate();
    const page = useListPageContext();
    const search = page.getSearch({});
    const pageTable = page.getTable();
    let props = p;
    if (extProps) {
      if (isFunction(extProps)) {
        props = extProps(p,search,pageTable);
      } else {
        props = { ...p, ...extProps };
      }
    }
    const {
      extraColumns,
      extraQueryColumns,
      request,
      params,
      selectionType = 'checkbox',
      onTabelRow,
      selectedRowKeys,
      selectedRows,
      getCheckboxProps,
      onLoad,
      //pagination,
      formatPrams,
      rowKey,
      className='cmp-dlg-container',
      ...resProps
    } = props;
    




    const ref = useRef<{ selectKeys?: any[] }>({});
    if (Array.isArray(extraQueryColumns) && extraQueryColumns.length > 0) {
      extraQueryColumns.forEach((item: FormSearchItem) => {
        search.addSearchItem({
          ...item,
          width: item.width ? item.width : 120,
        });
      });
    }
  
    if (Array.isArray(extraColumns) && extraColumns.length > 0) {
      extraColumns.forEach((item: ProColumn) => {
        pageTable.addCol(item);
      });
    }
    const searchConfig = search.toConfig();

    const pageInfo = pageTable.toConfig();

    const onSelectRow = (_selectedRowKeys: any[], _selectedRows: any[]) => {
      ref.current.selectKeys = _selectedRowKeys;
      onTabelRow && onTabelRow(_selectedRowKeys, _selectedRows);
      update();
    };
    const tableParams = useMemo(() => {
      let newPrams = {
        ...params,
        ...pageInfo.params,
      };
      if (typeof formatPrams === 'function') {
        newPrams = formatPrams(newPrams);
      }
      return newPrams;
    }, [params,formatPrams,JSON.stringify(pageInfo.params)]);

    const selectKeys = useMemo(() => {
      ref.current.selectKeys =
        selectedRowKeys || selectedRows?.map((item) => (rowKey ? item[rowKey] : ''));
      return ref.current.selectKeys;
    }, [selectedRowKeys, selectedRows, rowKey]);
    //const temSelecteds = uniq([...state.selectedRowKeys, ...selectedRowKeys]);
    // const title = `已选中:${
    //   Array.isArray(ref.current.selectKeys) ? ref.current.selectKeys.length : 0
    // }项`;
    const tableInfo: any = pageInfo;
    const {pagination:_pagination,onChange,...restTableProps}=tableInfo

    return (
      <Component>
        <ScCard className={className}>
          <BsSearch {...searchConfig} lightFilter />
          {/* <Alert message={title} type="info" style={{ marginBottom: '12px' }} showIcon /> */}
          <BsTable
            bordered
            checkbox
            autoload={true}
            {...restTableProps}
            rowSelection={{
              type: selectionType,
              getCheckboxProps,
            }}
            onLoad={onLoad}
            scroll={scroll}
            rowKey={rowKey}
            onSelectRow={onSelectRow}
            selectedRowKeys={selectKeys}
            selectedRows={selectedRows}
            params={tableParams}
            request={request}
            {...resProps}
          />
        </ScCard>
      </Component>
    );
  };

  return ListPage(Cmp, pageConfig);
}