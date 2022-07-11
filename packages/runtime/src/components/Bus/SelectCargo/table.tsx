import { ScTree } from '@scboson/sc-element';
import { ListPage, PageConfig, useListPageContext } from '@scboson/sc-schema';
import { FormSearchItem, ProColumn } from '@scboson/sc-schema/es/interface';
import TableInfo from '@scboson/sc-schema/lib/page/TableInfo';
import { CheckboxProps } from 'antd';
import { RowSelectionType } from 'antd/es/table/interface';
import React, { Key, useMemo, useState } from 'react';
import { uesRequest } from '../../../utils/api';
import BsSearch from '../../Base/BsSearch';
import BsTable from '../../Base/BsTable';
import BrandSelect from '../BrandSelect';
import styles from './index.less';
import list from './list';

const pagaConfig: PageConfig = {
  service: {},
  ...list,
};

export type SelectCargoTableProps = {
  extraColumns?: ProColumn[];
  extraQueryColumns?: FormSearchItem[];
  request: (params: any) => Promise<any>; // 请求数据的远程方法
  params?: any;
  selectionType: RowSelectionType;
  onTabelRow?: (selectedRowKeys: string[], selectedRows: any[]) => void;
  selectedRowKeys?: string[];
  isNeedLeft?: boolean;
  isNeddBrand?: boolean;
  rowKey?: string;
  onLoad?: (data: any) => any;
  formatPrams?: (params: any) => any;
  getCheckboxProps?: (
    record: any
  ) => Partial<Omit<CheckboxProps, 'defaultChecked' | 'checked'>>;
  formatTableInfo: (tableInfo: TableInfo) => TableInfo;
  waringFn?: () => React.ReactNode;
};

const SelectCargoTable: React.FC<SelectCargoTableProps> = (
  props: SelectCargoTableProps
) => {
  const {
    extraColumns,
    extraQueryColumns,
    request,
    params,
    selectionType = 'checkbox',
    onTabelRow,
    selectedRowKeys,
    isNeedLeft = true,
    isNeddBrand = false,
    getCheckboxProps,
    onLoad,
    formatPrams,
    formatTableInfo,
    rowKey = 'cargoId',
    waringFn,
  } = props;
  const { run } = uesRequest('catalog', 'treeData');
  const page = useListPageContext();
  const search = page.getSearch({});
  if (isNeddBrand) {
    search.addSearchItem({
      label: '品牌',
      name: 'brandName',
      component: BrandSelect,
      formItemProps: {},
      props: {
        allowClear: true,
        placeholder: '请选择品牌',
      },
    });
  }

  if (Array.isArray(extraQueryColumns) && extraQueryColumns.length > 0) {
    extraQueryColumns.forEach((item: FormSearchItem) => {
      search.addSearchItem({
        ...item,
        width: item.width ? item.width : 120,
      });
    });
  }
  const searchConfig = search.toConfig();

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  let pageTable = page.getTable();
  if (Array.isArray(extraColumns) && extraColumns.length > 0) {
    extraColumns.forEach((item: ProColumn) => {
      pageTable.addCol(item);
    });
  }

  if (formatTableInfo) {
    pageTable = formatTableInfo(pageTable);
  }

  const pageInfo = pageTable.toConfig();

  const loadDataPramsFormat = (item: any) => {
    return {
      parentCatalogCode: item.catalogCode,
    };
  };
  const treeParams = useMemo(() => {
    return {
      parentCatalogCode: 0,
    };
  }, []);

  const onSelectRow = (_selectedRowKeys: any[], _selectedRows: any[]) => {
    onTabelRow && onTabelRow(_selectedRowKeys, _selectedRows);
  };

  const handleSelect = (rselectedKeys: Key[]) => {
    setSelectedKeys(rselectedKeys);
    searchConfig.onSubmit({
      ...params,
      ...pageInfo.params,
      catalogId: rselectedKeys[0] ? String(rselectedKeys[0]) : null,
    });
  };
  const tableParams = useMemo(() => {
    let newPrams = {
      ...params,
      ...pageInfo.params,
      catalogId: selectedKeys[0] ? String(selectedKeys[0]) : null,
    };
    if (typeof formatPrams === 'function') {
      newPrams = formatPrams(newPrams);
    }
    return newPrams;
  }, [JSON.stringify(pageInfo.params), params, JSON.stringify(selectedKeys)]);

  const tableInfo: any = pageInfo;

  const handelClick = () => {
    searchConfig.onSubmit({
      ...pageInfo.params,
      catalogId: null,
    });
    setSelectedKeys([]);
  };

  // const handleLoad = (data: any) => {
  //   let newData = tableInfo.onLoad(data)
  //   newData = onLoad ? onLoad(newData) : newData
  //   return newData
  // }

  return (
    <div className={styles.cell}>
      {isNeedLeft ? (
        <div className={styles['cell-left']}>
          <div>
            <a onClick={handelClick}>全部货品</a>
          </div>
          <ScTree
            selectedKeys={selectedKeys}
            canSearch={false}
            placeholder={'search'}
            async={true}
            showLine={true}
            loadDataPramsFormat={loadDataPramsFormat}
            autoload={true}
            request={run}
            params={treeParams}
            textField="catalogName"
            onSelect={handleSelect}
            valueField="catalogId"
          />
        </div>
      ) : null}
      <div className={styles['catalog-table']}>
        <BsSearch {...searchConfig}></BsSearch>
        {waringFn ? waringFn() : null}
        <div>
          已选货品：
          {Array.isArray(selectedRowKeys) ? selectedRowKeys.length : 0}
        </div>
        <BsTable
          {...tableInfo}
          checkbox
          autoload={true}
          rowSelection={{
            type: selectionType,
            getCheckboxProps,
          }}
          rowKey={rowKey}
          onSelectRow={onSelectRow}
          selectedRowKeys={selectedRowKeys}
          params={tableParams}
          request={request}
          onLoad={onLoad}
          scroll={{ y: '300px' }}
          cardProps={{ bodyStyle: { padding: '0' } }}
        ></BsTable>
      </div>
    </div>
  );
};
const CargoTable: React.FunctionComponent<any> = ListPage(
  SelectCargoTable,
  pagaConfig
);
export default CargoTable;
