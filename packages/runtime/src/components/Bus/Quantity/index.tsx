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
  returnReason: string
  unitName?: string
  getMax?: (record: any) => number
  getMin?: (record: any) => number
  getSuffix?: (record: any) => React.ReactNode
  promptRender?: (value: any, record: any) => React.ReactNode
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
    <div>
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
    </div>
  )
}
Quantity.customView = true

export default Quantity
