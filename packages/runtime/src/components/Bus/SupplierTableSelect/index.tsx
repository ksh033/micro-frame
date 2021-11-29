/* eslint-disable max-len */

import React, { useRef, useEffect } from 'react'
import { Input, message, Select } from 'antd'
import { CModal } from '@scboson/sc-element'
import TableModal from './table'
import type {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form'

interface TableSelectProps extends FormComponentProps {
  placeholder?: string
  value?: any
  title?: string
  onChange?: (value: any) => void
  selectionType?: 'checkbox' | 'radio'
  textField?: any
  valueField?: string
  isCooperateSupplier?: boolean
  supplierEnabled?: boolean | null
  disabled?: boolean
  preClick?: () => boolean
  params?: any
}

const TabelSelect: FormComponent<TableSelectProps> = (
  props: TableSelectProps
) => {
  const {
    placeholder = '选择供应商',
    title = '选择供应商',
    selectionType = 'radio',
    onChange,
    value = [],
    textField = 'supplierName',
    valueField = 'supplierId',
    isCooperateSupplier = false,
    readonly,
    supplierEnabled = true,
    form,
    preClick,
    params = {},
    ...resProps
  } = props

  const stateRef = useRef<any>({
    selectedRowKeys: [],
    selectedRows: [],
  })

  if (Array.isArray(value)) {
    stateRef.current = {
      selectedRowKeys: value.map((item) => item[`${valueField}`]),
      selectedRows: value,
    }
  }

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
    if (resProps.disabled) {
      return
    }
    const preFlag = typeof preClick === 'function' ? preClick?.() : true
    if (preFlag) {
      CModal.show({
        title,
        width: '1200px',
        content: TableModal,
        pageProps: {
          onTabelRow,
          selectionType,
          isCooperateSupplier,
          supplierEnabled,
          rowKey: valueField,
          ...stateRef.current,
          exterParams: params,
        },
        onOk: () => {
          if (
            Array.isArray(stateRef.current.selectedRows) &&
            stateRef.current.selectedRows.length > 0
          ) {
            onChange?.(stateRef.current.selectedRows)
            return Promise.resolve()
          } else {
            message.warning('请最少选择一个供应商')
            return Promise.reject()
          }
        },
      })
    }
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

  if (readonly === true) {
    return <span>{formatInputValue(value)}</span>
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
          allowClear
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
TabelSelect.customView = true
export default TabelSelect
