/* eslint-disable no-restricted-globals */
import {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form'
import { useSetState, useUpdateEffect } from 'ahooks'
import React, { useEffect } from 'react'
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
    addonAfter,
    addonBefore,
    ...restProps
  } = props

  const formatValue = (rVal: any) => {
    if (rVal === '' || rVal === null || rVal === undefined) {
      return ''
    }
    const reg = /-?(0|[1-9]\d*)(\.\d+)?/
    if (!isNaN(rVal) && reg.test(rVal)) {
      return compute.divide(rVal, 10000).toFixed(complement)
    } else {
      return ''
    }
  }

  const [state, setState] = useSetState<BsPriceInputState>({
    value: formatValue(value),
  })

  useUpdateEffect(() => {
    if (value !== null && value !== undefined && value !== state.value) {
      setState({
        value: formatValue(value),
      })
    }
  }, [value])

  const handleChange = (rValue: any) => {
    setState({
      value: rValue,
    })
  }
  const onBlur = (rValue: any) => {
    const reg = /-?(0|[1-9]\d*)(\.\d+)?/
    if (!isNaN(rValue) && reg.test(rValue)) {
      onChange &&
        onChange(compute.multiply(Number(rValue).toFixed(complement), 10000))
    } else {
      onChange && onChange('')
    }
  }

  if (readonly) {
    return <div>{addonBefore}{formatValue(value)}{addonAfter}</div>
  }

  return (
    <BsNumberInput
      value={formatValue(value)}
      onChange={handleChange}
      onBlur={onBlur}
      addonAfter={addonAfter}
      addonBefore={addonBefore}
      complement={complement}
      {...restProps}
    ></BsNumberInput>
  )
}

BsPriceInput.customView = true

export default BsPriceInput
