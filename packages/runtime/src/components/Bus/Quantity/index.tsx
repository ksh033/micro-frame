import React, { useMemo } from 'react'
import BsNumberInput from '../../Base/BsNumberInput'
import useWeightUnit from '../../Dict/weightUnit'
import type {
  TableComponentProps,
  TableComponent,
} from '@scboson/sc-element/es/sc-editable-table/typing'

interface QuantityProps extends TableComponentProps {
  onChange: (val: any) => any
  value?: any
  unitName?: string
  getMax?: (record: any) => number
  getMin?: (record: any) => number
  getSuffix?: (record: any) => React.ReactNode
  promptRender?: (value: any, record: any) => React.ReactNode
  style?: any
  id?: any
}

const Quantity: TableComponent<QuantityProps> = (props) => {
  const {
    rowData,
    value,
    onChange,
    getMax,
    getMin,
    getSuffix,
    unitName = 'cargoUnit',
    promptRender,
    form,
    ...resProps
  } = props

  const { weightUnit, has } = useWeightUnit()

  const max = getMax?.(rowData) || undefined

  const min = getMin?.(rowData) || undefined

  const IsWeightUnit = useMemo(() => {
    return has(rowData[unitName])
  }, [unitName, JSON.stringify(rowData)])

  const complement = useMemo(() => {
    if (IsWeightUnit) {
      return 3
    }
    return 0
  }, [IsWeightUnit])

  return (
    <>
      <BsNumberInput
        value={value !== undefined && value !== null ? String(value) : value}
        onChange={onChange}
        suffix={getSuffix?.(rowData)}
        complement={complement}
        max={max}
        min={min}
        {...resProps}
      />
      {promptRender ? promptRender(value, rowData) : null}
    </>
  )
}
Quantity.customView = true

export default Quantity
