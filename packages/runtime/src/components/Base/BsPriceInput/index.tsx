/* eslint-disable no-restricted-globals */
import { FormComponent } from '@scboson/sc-element/es/c-form'
import React from 'react'
import BsNumberInput, { BsNumberInputProps } from '../BsNumberInput'

type BsPriceInputProps = BsNumberInputProps

const BsPriceInput: FormComponent<BsPriceInputProps> = (props) => {
  const { value, onChange, readOnly, ...restProps } = props

  const handleChange = (_value: any) => {
    const reg = /^-?\d*(\.\d*)?$/
    if (!isNaN(_value) && reg.test(_value)) {
      onChange && onChange(_value * 10000)
    } else {
      onChange && onChange('')
    }
  }

  const formatValue = (rVal: any) => {
    const reg = /^-?\d*(\.\d*)?$/
    if (!isNaN(rVal) && reg.test(rVal)) {
      return rVal / 10000
    } else {
      return rVal
    }
  }

  if (readOnly) {
    return formatValue(value)
  }

  return (
    <BsNumberInput
      value={formatValue(value)}
      onChange={handleChange}
    ></BsNumberInput>
  )
}

BsPriceInput.customView = true

export default BsPriceInput
