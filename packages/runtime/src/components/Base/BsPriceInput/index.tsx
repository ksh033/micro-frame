/* eslint-disable no-restricted-globals */
import React from 'react'
import { Input } from 'antd'

const BsPriceInput: React.FC<any> = (props) => {
  // complement 为补0位数
  const {
    value,
    onChange,
    min = false,
    max = false,
    complement = 2,
    ...restProps
  } = props

  const handleChange = (e: any) => {
    const _value = e.target.value
    const reg = /^-?\d*(\.\d*)?$/
    if ((!isNaN(_value) && reg.test(_value)) || _value === '') {
      onChange && onChange(_value)
    } else {
      onChange && onChange('')
    }
  }

  const handleBlur = () => {
    const _val = value
    const reg = /^-?\d*(\.\d*)?$/
    const newVal = String(_val)
    if (!isNaN(_val) && reg.test(newVal) && _val !== '') {
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
      let str = `${parseFloat(`${_val}`).toFixed(num)}`
      // 判断是否配置最大最小值
      if (min !== false && min > _val) {
        str = min
      }
      if (max !== false && max < _val) {
        str = max
      }
      onChange && onChange(str)
    }
  }

  return (
    <Input
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      {...restProps}
    ></Input>
  )
}

export default BsPriceInput
