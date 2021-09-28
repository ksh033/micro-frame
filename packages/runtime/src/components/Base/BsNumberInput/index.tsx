/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'
import { Input } from 'antd'
import type { InputProps } from 'antd'
import { useUpdateEffect } from 'ahooks'

export type BsNumberInputProps = {
  value?: any
  onChange?: (value: any) => any
  min?: number | false // 最小值
  max?: number | false // 最大值
  complement?: number // 小数点后几位
  onBlur?: (value: any) => void
} & Omit<InputProps, 'onBlur'>

const BsNumberInput: React.FC<BsNumberInputProps> = (props) => {
  // complement 为补0位数
  const {
    value,
    onChange,
    min = false,
    max = false,
    complement = 2,
    onBlur,
    ...restProps
  } = props

  const [newValue, setNewValue] = useState(value)

  useUpdateEffect(() => {
    if (value !== undefined && value !== null) {
      setNewValue(value)
    }
  }, [value])

  const formatValue = (rvalue: any) => {
    if (rvalue===""||rvalue===null||rvalue===undefined){
      return "";
    }
    
    const _val = rvalue
    const newVal = String(_val)
    let num = complement
    if (newVal.indexOf('.') > -1) {
      num = newVal.substring(newVal.indexOf('.') + 1, newVal.length).length
    } else {
      num = complement
    }
    if (num <= complement) {
      num = complement
    }
    if (num >= complement) {
      num = complement
    }
    let str = parseFloat(`${_val}`).toFixed(num)
    // 判断是否配置最大最小值
    if (min !== false && min > _val) {
      str = min + ''
    }
    if (max !== false && max < _val) {
      str = max + ''
    }
    return str
  }

  const handleChange = (e: any) => {
    const _value = e.target.value
    setNewValue(_value)
    onChange && onChange(_value)
  }

  const handleBlur = () => {
    const _val = newValue
    const reg = /^-?\d*(\.\d*)?$/
    const newVal = String(_val)
    if (!isNaN(_val) && reg.test(newVal) && _val !== '') {
      const str = formatValue(newVal)
      setNewValue(str)
      onChange && onChange(str)
      onBlur && onBlur(str)
    } else {
      setNewValue('')
      onChange && onChange('')
      onBlur && onBlur('')
    }
  }

  return (
    <Input
      value={newValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...restProps}
    ></Input>
  )
}

export default BsNumberInput
