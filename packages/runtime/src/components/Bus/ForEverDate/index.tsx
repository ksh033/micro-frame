import React, { useState, useEffect } from 'react'
import { ScDatePicker } from '@scboson/sc-element'
import { Checkbox } from 'antd'
import { ValidateUtil } from '@scboson/sc-utils'
import { FormComponent } from '@scboson/sc-element/es/c-form'

/**
 * 字典控件
 *
 * @param pros 字典控件属性
 */
const CheckBoxDate: FormComponent<any> = (pros: any) => {
  const { form, readonly, initialValues, ...restProps } = pros
  const [disabled, setDisabled] = useState(false)
  function onChange(e: { target: { checked: React.SetStateAction<boolean> } }) {
    setDisabled(e.target.checked)
    if (e.target.checked) {
      restProps.onChange?.('2199-12-31')
    } else {
      restProps.onChange?.(null)
    }
  }

  useEffect(() => {
    onChange({ target: { checked: false } })
  }, [])

  // if (readonly) {
  //   return <div>{initialValues[dateName] || '--'}</div>
  // }

  return (
    <>
      <ScDatePicker.ScDatePicker
        format="YYYY-MM-DD"
        disabled={disabled}
        style={{ width: '300px', marginRight: '8px' }}
        {...restProps}
      ></ScDatePicker.ScDatePicker>
      <Checkbox onChange={onChange}>永久有效</Checkbox>
    </>
  )
}

CheckBoxDate.customView = true
export default CheckBoxDate
