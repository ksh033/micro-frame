import React, { useState, useEffect } from 'react'
import { ScDatePicker } from '@scboson/sc-element'
import { Form, Input, Checkbox } from 'antd'
import { ValidateUtil } from '@scboson/sc-utils'
import { FormComponent } from '@scboson/sc-element/es/c-form'

/**
 * 字典控件
 *
 * @param pros 字典控件属性
 */
const CheckBoxDate: FormComponent<any> = (pros: any) => {
  // const { dict } = useModel('userDictModel')
  // const effectType=dict['effectType']
  const {
    name = ['datePicker', 'checkbox'],
    form,
    readonly,
    initialValues,
  } = pros
  const dateName = name[0]
  const checkBoxName = name[1]
  const [disabled, setDisabled] = useState(false)
  function onChange(e: { target: { checked: React.SetStateAction<boolean> } }) {
    setDisabled(e.target.checked)
    const _v = {}
    _v[checkBoxName] = e.target.checked

    form.setFieldsValue(_v)
  }

  useEffect(() => {
    onChange({ target: { checked: false } })
  }, [])
  const checkVal = (rule: any, v: any) => {
    const { field } = rule

    if (field === dateName) {
      const boxVal = form.getFieldValue(checkBoxName)
      if (boxVal === false && (!v || ValidateUtil.isEmpty(v))) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('请输入日期')
      }
    }
    return Promise.resolve()
  }

  if (readonly) {
    return <div>{initialValues[dateName] || '--'}</div>
  }

  return (
    <Form.Item noStyle>
      <Input.Group compact>
        <Form.Item name={dateName} rules={[{ validator: checkVal }]}>
          <ScDatePicker.ScDatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            disabled={disabled}
            {...pros}
          ></ScDatePicker.ScDatePicker>
        </Form.Item>
        <Form.Item name={checkBoxName} style={{ marginLeft: '5px' }}>
          <Checkbox onChange={onChange}>立即生效</Checkbox>
        </Form.Item>
      </Input.Group>
    </Form.Item>
  )
}

CheckBoxDate.customView = true
export default CheckBoxDate
