import React, { useMemo } from 'react'
import userDictModel from '../../Dict/userDictModel'
import { ScSelect } from '@scboson/sc-element'
import { getUser } from '../../Auth'
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
    ...restProps
  } = pros
  const { dict, getBySysCode } = userDictModel()
  const user = getUser()
  const systemCode = user?.userAppInfo.currentSystem.systemCode || ''

  const sysMap = getBySysCode(sysCode || systemCode)

  const data = useMemo(() => {
    if (dictType && sysMap && sysMap[dictType]) {
      return sysMap[dictType]
    }
    return []
  }, [dictType])
  if (readonly) {
    const formData: any = form?.getFieldsValue()
    let val = deepGet(formData, name)
    if (!val) {
      val = deepGet(initialValues, name)
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
