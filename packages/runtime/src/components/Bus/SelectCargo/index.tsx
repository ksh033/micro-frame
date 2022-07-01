import { CModal } from '@scboson/sc-element';
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

  const [state, setState] = useSetState<{
    selectedRowKeys: string[];
    selectedRows: any[];
  }>({
    selectedRowKeys: pageProps.selectedRowKeys || [],
    selectedRows: [],
  });

  const onTabelRow = (selectedRowKeys: string[], selectedRows: any[]) => {
    setState({
      selectedRowKeys,
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
  CModal.show({
    title: '添加货品',
    width: 1400,
    ...newOptions,
    content: SelectCargo,
  });
}

export default SelectCargo;
