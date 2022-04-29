/* eslint-disable react-hooks/exhaustive-deps */
import type { FC, PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { ScSelectTable } from '@scboson/sc-element';
import type { ScSelectTableProps } from '@scboson/sc-element/es/sc-select-table';
import type {
  ScProColumn,
  ScTableProps,
} from '@scboson/sc-element/es/sc-table';

export type GoodsSelectTableProps = {
  dropdownRenderProps?: ScTableProps<any>;
  /** @name table 列属性 */
  columns?: ScProColumn<any>;
  unitDataIndexName?: string;
} & Omit<ScSelectTableProps, 'dropdownRenderProps'>;

const GoodsSelectTable: FC<PropsWithChildren<GoodsSelectTableProps>> = (
  props
) => {
  const {
    dropdownRenderProps,
    params,
    valueField = 'goodsId',
    onLoad,
    columns = [],
    autoload = false,
    ...restProps
  } = props;

  const baseColumns = [
    {
      title: '商品编码',
      dataIndex: 'goodsCode',
      width: 80,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      width: 150,
    },
    {
      title: '商品品目',
      dataIndex: 'catalogName',
      width: 150,
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      width: 80,
    },
    {
      title: '销售单位',
      dataIndex: 'saleUnit',
      width: 80,
    },
  ];

  const newColumns = useMemo(() => {
    if (Array.isArray(columns) && columns.length > 0) {
      return columns;
    }
    return baseColumns;
  }, [columns]);

  const newParams = useMemo(() => {
    return params
      ? { ...params, current: 1, size: 10 }
      : { current: 1, size: 10 };
  }, [JSON.stringify(params)]);

  const handleLoad = (data: any) => {
    const dataList = data.records || data.rows;
    if (Array.isArray(dataList)) {
      let newData = dataList;
      if (onLoad) {
        newData = onLoad(newData);
      }
      return newData;
    }
    return [];
  };

  return (
    <ScSelectTable
      remoteSearch
      openReloadData={false}
      labelInValue
      showSearch
      valueField={valueField}
      singleInput={true}
      textField="cargoName"
      searchField="cargoCodeName"
      allowClear
      placeholder="请选择/请输入商品名称"
      style={{ width: '400px' }}
      dropdownStyle={{ minWidth: '580px' }}
      dropdownRenderProps={{
        columns: newColumns,
        scroll: { y: '300px' },
      }}
      onLoad={handleLoad}
      params={newParams}
      autoload={autoload}
      {...restProps}
    />
  );
};

export default GoodsSelectTable;
