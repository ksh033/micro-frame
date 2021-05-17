/* eslint-disable no-restricted-globals */
import { FormComponent } from '@scboson/sc-element/es/c-form'
import { useSetState, useUpdateEffect } from 'ahooks'
import React from 'react'
import BsNumberInput, { BsNumberInputProps } from '../BsNumberInput'

type BsPriceInputProps = BsNumberInputProps

type BsPriceInputState = {
  value: any
}

const BsPriceInput: FormComponent<BsPriceInputProps> = (props) => {
  const { value, onChange, readOnly, ...restProps } = props

  const formatValue = (rVal: any) => {
    const reg = /^-?\d*(\.\d*)?$/
    if (!isNaN(rVal) && reg.test(rVal)) {
      return rVal / 10000
    } else {
      return rVal
    }
  }

  const [state, setState] = useSetState<BsPriceInputState>({
    value: formatValue(value),
  })

  const handleChange = (rValue: any) => {
    setState({
      value: rValue,
    })
  }

  useUpdateEffect(() => {
    if (value !== null && value !== undefined) {
      setState({
        value: formatValue(value),
      })
    }
  }, [value])

  const onBlur = (rValue: any) => {
    const reg = /^-?\d*(\.\d*)?$/
    if (!isNaN(rValue) && reg.test(rValue)) {
      onChange && onChange(rValue * 10000)
    } else {
      onChange && onChange(rValue)
    }
  }

  if (readOnly) {
    return formatValue(value)
  }

  return (
    <BsNumberInput
      value={state.value}
      onChange={handleChange}
      onBlur={onBlur}
    ></BsNumberInput>
  )
}

BsPriceInput.customView = true

export default BsPriceInput
