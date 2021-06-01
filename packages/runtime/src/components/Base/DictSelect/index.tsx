import React, { useMemo } from 'react'
import userDictModel from '../../Dict/userDictModel'
import { ScSelect } from '@scboson/sc-element'
import { ScSelectProps } from '@scboson/sc-element/lib/sc-select/index'

import {
  FormComponent,
  FormComponentProps,
  deepGet,
} from '@scboson/sc-element/es/c-form'

export interface DictSelectProp extends ScSelectProps, FormComponentProps {
  /** 字典类型 */
  dictType: string
  /** 系统 */
  sysCode?: string
  fieldProps?: any
  filterData?: (dictData: any[]) => any[]
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
    sysCode,
    name,
    form,
    initialValues,
    formItemProps,
    fieldProps,
    filterData,
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
    const valItem = data.find((item) => {
      return item.value === val
    })
    const text = valItem?.name

    return <span>{text}</span>
  } else {
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
