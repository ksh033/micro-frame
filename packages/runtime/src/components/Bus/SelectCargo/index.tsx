import { FC, useState } from 'react'
import SelectCargoTable, { SelectCargoTableProps } from './table'
import ModalPageContainer from '../../../components/Base/Tpl/ModalPageTpl'
import { CModal } from '@scboson/sc-element'
import { DialogOptions, ToolButtons } from '@scboson/sc-schema/lib/interface'
import { useSetState } from 'ahooks'

type SelectCargoProps = {
  title?: string
  close: () => void
  pageProps: Omit<SelectCargoTableProps, 'selectedRowKeys'>
}

const SelectCargo: FC<SelectCargoProps> = (props: SelectCargoProps) => {
  const { title = '添加货品', pageProps, close, ...restProps } = props

  const [state, setState] = useSetState<{
    selectedRowKeys: string[]
    selectedRows: any[]
  }>({
    selectedRowKeys: [],
    selectedRows: [],
  })

  const onTabelRow = (selectedRowKeys: string[], selectedRows: any[]) => {
    setState({
      selectedRowKeys,
      selectedRows,
    })
    pageProps?.onTabelRow?.(selectedRowKeys, selectedRows)
  }

  return (
    <SelectCargoTable
      {...pageProps}
      onTabelRow={onTabelRow}
      selectedRowKeys={state.selectedRowKeys}
    ></SelectCargoTable>
  )
}

export function openSelectCargoModal(newOptions: DialogOptions) {
  CModal.show({
    title: '添加货品',
    width: 1400,
    ...newOptions,
    content: SelectCargo,
  })
}

export default SelectCargo
