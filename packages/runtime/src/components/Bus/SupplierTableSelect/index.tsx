/* eslint-disable max-len */

import React, { useRef } from 'react'
import { Input, Select } from 'antd'
import { CModal } from '@scboson/sc-element'

import TableModal from './table'

interface TableSelectProps {
  placeholder?: string
  value?: any
  title?: string
  onChange?: (value: any) => void
  selectionType?: 'checkbox' | 'radio'
  textField?: any
  valueField?: string
  isCooperateSupplier?: boolean
}

const TabelSelect: React.FC<TableSelectProps> = (props: TableSelectProps) => {
  const {
    placeholder = 'Basic usage',
    title = '选择供应商',
    selectionType = 'radio',
    onChange,
    value = [],
    textField = 'supplierName',
    valueField = 'supplierId',
    isCooperateSupplier = false,
    ...resProps
  } = props

  const stateRef = useRef<any>({
    selectedRowKeys: [],
    selectedRows: [],
  })

  const onTabelRow = (selectedRowKeys: any[], selectedRows: any[]) => {
    stateRef.current = {
      selectedRowKeys,
      selectedRows,
    }
  }

  const formatSelectValue = (list: any[]) => {
    if (Array.isArray(list) && list.length > 0) {
      const values = list.map((item: any) => {
        return {
          value: item[valueField],
          label: item[textField],
          item,
        }
      })
      return values
    }
    return []
  }

  const handleClick = () => {
    CModal.show({
      title,
      width: '1200px',
      content: TableModal,
      pageProps: {
        onTabelRow,
        selectionType,
        isCooperateSupplier,
        rowKey: valueField,
        ...stateRef.current,
      },
      onOk: async () => {
        onChange?.(stateRef.current.selectedRows)
      },
    })
  }

  const handleChange = (e: any[]) => {
    let selectedRowKeys: any[] = []
    if (Array.isArray(e) && e.length > 0) {
      selectedRowKeys = e.map((item, index) => {
        return item.value || index
      })
    }

    let selectedRows: any[] = []
    if (
      Array.isArray(stateRef.current.selectedRows) &&
      stateRef.current.selectedRows.length > 0 &&
      selectedRowKeys.length > 0
    ) {
      selectedRows = stateRef.current.selectedRows.filter((item: any) => {
        return item[valueField].includes(selectedRowKeys)
      })
    }

    stateRef.current = {
      selectedRowKeys,
      selectedRows,
    }
    onChange?.(selectedRows)
  }

  const formatInputValue = (list: any[]) => {
    if (Array.isArray(list) && list.length === 1) {
      const values = list[0][textField] || ''
      return values
    }
    return ''
  }

  if (selectionType === 'checkbox') {
    return (
      <div onClick={handleClick}>
        <Select
          mode="multiple"
          placeholder={placeholder}
          value={formatSelectValue(value)}
          style={{ width: '100%' }}
          labelInValue
          open={false}
          onChange={handleChange}
          {...resProps}
        ></Select>
      </div>
    )
  }
  return (
    <div onClick={handleClick}>
      <Input
        placeholder={placeholder}
        value={formatInputValue(value)}
        readOnly
        {...resProps}
      />
    </div>
  )
}

export default TabelSelect
