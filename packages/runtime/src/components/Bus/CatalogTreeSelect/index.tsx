/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useState } from 'react'
import { ScTreeSelect } from '@scboson/sc-element'
import type {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form'
import { uesRequest } from '../../../utils/api'

export interface AreaDataProps {
  areaCode: string
  areaLevel: string
  areaName: string
}

export interface AreaSelecthProps extends FormComponentProps {
  placeholder?: string
  form?: any
  county?: boolean
  style?: any
  value?: any
  onChange?: any
  data: any
  root: any
  dispatch: any
  modelKey: any
  checkbox?: boolean
  fieldProps?: any
}

const CatalogTreeSelect: FormComponent<AreaSelecthProps> = (
  props: AreaSelecthProps = {
    data: [],
    root: null,
    dispatch: null,
    modelKey: null,
  }
) => {
  const { run } = uesRequest('catalog', 'treeData')
  const [treeValue, setTreeValue] = useState<any>()
  const {
    form,
    placeholder,
    style,
    data = [],
    county,
    value,
    onChange,
    readonly,
    fieldProps,
    initialValues,
    ...restProps
  } = props

  const params = useMemo(() => {
    return { parentCatalogCode: '0' }
  }, [])

  const onSelectChange = (rvalue: any, option: any) => {
    setTreeValue(rvalue)
    if (onChange) {
      onChange({
        catalogCode: option.catalogCode,
        catalogId: option.catalogId,
        value: option.catalogId,
        label: option.catalogName,
      })
    }
  }

  useEffect(() => {
    if (value && !treeValue) {
      onChange?.(value)
      setTreeValue({
        ...value,
        value: value.catalogId,
        label: value.catalogName || value.label,
      })
    }
  }, [JSON.stringify(value)])

  const loadDataPramsFormat = (item: any) => {
    return {
      parentCatalogCode: item.catalogCode,
    }
  }

  const onValueChange = (rvalue: any) => {
    if (rvalue === undefined) {
      onChange?.(rvalue)
      setTreeValue(rvalue)
    }
  }

  const render = () => {
    if (readonly) {
      let text = ''
      if (treeValue) {
        text = treeValue.label
      }
      return <>{text}</>
    }
    return (
      <ScTreeSelect
        textField="catalogName"
        valueField="catalogId"
        params={params}
        onSelect={onSelectChange}
        onChange={onValueChange}
        multiple={false}
        labelInValue
        value={treeValue}
        loadDataPramsFormat={loadDataPramsFormat}
        request={run}
        autoload
        data={data}
        placeholder="请选择品目"
        {...restProps}
      ></ScTreeSelect>
    )
  }
  return <>{render()}</>
}
CatalogTreeSelect.customView = true

export default CatalogTreeSelect
