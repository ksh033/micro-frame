import { CDrawer } from '@scboson/sc-element';
import { DialogOptions } from '@scboson/sc-schema/es/interface';
import { useSetState } from 'ahooks';
import { FC } from 'react';
import SelectCargoTable, { SelectCargoTableProps } from './table';

type SelectCargoProps = {
  title?: string;
  close: () => void;
  pageProps: SelectCargoTableProps;
};

const SelectCargo: FC<SelectCargoProps> = (props: SelectCargoProps) => {
  const { title = '添加货品', pageProps, close, ...restProps } = props;
  const defaultRowKeys = pageProps.selectedRowKeys || [];
  const [state, setState] = useSetState<{
    selectedRowKeys: string[];
    selectedRows: any[];
  }>({
    selectedRowKeys: defaultRowKeys,
    selectedRows: [],
  });

  const onTabelRow = (selectedRowKeys: string[], selectedRows: any[]) => {
    const keys = Array.from(new Set([...defaultRowKeys, ...selectedRowKeys]));
    setState({
      selectedRowKeys: keys,
      selectedRows,
    });
    pageProps?.onTabelRow?.(selectedRowKeys, selectedRows);
  };

  return (
    <SelectCargoTable
      {...pageProps}
      onTabelRow={onTabelRow}
      selectedRowKeys={state.selectedRowKeys}
    ></SelectCargoTable>
  );
};

export function openSelectCargoModal(newOptions: DialogOptions) {
  CDrawer.show({
    title: '添加货品',
    width: 1400,
    ...newOptions,
    content: SelectCargo,
  });
}

export default SelectCargo;
