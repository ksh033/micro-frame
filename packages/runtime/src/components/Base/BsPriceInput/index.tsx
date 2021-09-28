/* eslint-disable no-restricted-globals */
import {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form'
import { useSetState, useUpdateEffect } from 'ahooks'
import React from 'react'
import BsNumberInput, { BsNumberInputProps } from '../BsNumberInput'
import compute from '../../../utils/compute'


type BsPriceInputProps = BsNumberInputProps &
  FormComponentProps & {
    rowData?: any
  }

type BsPriceInputState = {
  value: any
}

const BsPriceInput: FormComponent<BsPriceInputProps> = (props) => {
  const {
    value,
    onChange,
    readonly,
    rowData,
    complement = 2,
    ...restProps
  } = props

  const formatValue = (rVal: any) => {
    if (rVal===""||rVal===null||rVal===undefined){
      return "";
    }
    const reg =  /-?(0|[1-9]\d*)(\.\d+)?/
    if (!isNaN(rVal) && reg.test(rVal)) {
      return compute.divide(rVal, 10000).toFixed(complement)
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
    const reg = /-?(0|[1-9]\d*)(\.\d+)?/
    if (!isNaN(rValue) && reg.test(rValue)) {
      onChange && onChange(compute.multiply(rValue, 10000))
    } else {
      onChange && onChange(rValue)
    }
  }

  if (readonly) {
    return <div>{formatValue(value)}</div>
  }

  return (
    <BsNumberInput
      value={state.value}
      onChange={handleChange}
      onBlur={onBlur}
      complement={complement}
      {...restProps}
    ></BsNumberInput>
  )
}

BsPriceInput.customView = true

export default BsPriceInput
