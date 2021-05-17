/* eslint-disable no-restricted-globals */
import React from 'react'
import BsNumberInput, { BsNumberInputProps } from '../BsNumberInput'

type BsPriceInputProps = BsNumberInputProps

const BsPriceInput: React.FC<BsPriceInputProps> = (props) => {
  const { value, onChange, ...restProps } = props

  const handleChange = (e: any) => {
    const _value = e.target.value
    const reg = /^-?\d*(\.\d*)?$/
    if (!isNaN(_value) && reg.test(_value)) {
      onChange && onChange(_value * 10000)
    } else {
      onChange && onChange('')
    }
  }

  const formatValue = (rVal: number) => {
    return rVal / 10000
  }

  return (
    <BsNumberInput
      value={formatValue(value)}
      onChange={handleChange}
    ></BsNumberInput>
  )
}

export default BsPriceInput
