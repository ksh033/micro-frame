import React, { useMemo } from 'react'
import userDictModel from '../../Dict/userDictModel'
import { ScSelect, ScRadio, ScCheckBox } from '@scboson/sc-element'
import { ScSelectProps } from '@scboson/sc-element/es/sc-select/index'
import { ScRadioProps } from '@scboson/sc-element/es/sc-radio/index'
import { ScCheckProps } from '@scboson/sc-element/es/sc-check-box/index'
import {
  FormComponent,
  FormComponentProps,
  deepGet,
} from '@scboson/sc-element/es/c-form'

export interface DictSelectProp extends FormComponentProps {
  /** 字典类型 */
  dictType: string
  /** 系统 */
  sysCode?: string
  type?: 'Select' | 'Radio' | 'CheckBox'
  fieldProps?: any
  filterData?: (dictData: any[]) => any[]
  rowData?: any
  splitDot?: string
  [key: string]: any
}

/**
 * 字典控件
 *
 * @param pros 字典控件属性
 */
const DictSelect: FormComponent<DictSelectProp> = (pros: DictSelectProp) => {
  const {
    dictType,
    readonly,
    type = 'Select',
    sysCode,
    name,
    form,
    initialValues,
    formItemProps,
    fieldProps,
    filterData,
    splitDot = '、',
    rowData,
    ...restProps
  } = pros
  const { getDistList } = userDictModel()

  let data = useMemo(() => {
    const list = getDistList({
      syscode: sysCode,
      dictTypeCode: dictType,
    })

    if (list) {
      return list
    }
    return []
  }, [dictType, sysCode])

  if (filterData) {
    data = filterData(data)
  }
  if (readonly) {
    let newName: any = name || ''
    const formData: any = form?.getFieldsValue() || {}
    let val = deepGet(formData, newName)
    if (!val && initialValues) {
      val = deepGet(initialValues, newName)
    }
    if (Array.isArray(val)) {
      const valItemList = data
        .filter((it) => {
          return val.indexOf(it.value) > -1
        })
        .map((item) => item.name)

      return <span>{valItemList.join(splitDot)}</span>
    } else {
      const valItem = data.find((item) => {
        return item.value === val
      })
      const text = valItem?.name

      return <span>{text}</span>
    }
  } else {
    if (type === 'Radio') {
      const radioProps: any = restProps
      return (
        <ScRadio
          textField="name"
          valueField="value"
          data={data}
          {...radioProps}
        ></ScRadio>
      )
    }
    if (type === 'CheckBox') {
      const checkProps: any = restProps
      return (
        <ScCheckBox
          textField="name"
          valueField="value"
          data={data}
          {...checkProps}
        ></ScCheckBox>
      )
    }
    return (
      <ScSelect
        textField="name"
        valueField="value"
        data={data}
        allowClear
        {...restProps}
      ></ScSelect>
    )
  }
}
DictSelect.customView = true

export default DictSelect
