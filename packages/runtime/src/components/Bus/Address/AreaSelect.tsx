import React, { useMemo, useState } from 'react'
import { ScCascader } from '@scboson/sc-element'
import { FormComponentProps } from '@scboson/sc-element/es/c-form'
import { uesRequest } from '../../../utils/api'

export interface AreaDataProps {
  areaCode: string
  areaLevel: string
  areaName: string
  // province: string; // 省
  // city: number; // 市
  // district: number; // 区
}
const fields = ['province', 'city', 'district', 'county']

export interface AreaSelecthProps extends FormComponentProps {
  placeholder?: string
  // areaLevel?: AreaLevel | undefined;
  province?: boolean
  city?: boolean
  district?: boolean
  county?: boolean
  style?: any
  value?: any
  onChange?: (value: any, selectOptions: any) => void
}
const defaultProp: AreaSelecthProps = {
  placeholder: '请选择省',
  province: true,
  city: true,
}
const AareSelect: React.FC<AreaSelecthProps> = (
  areaSelecthProps: AreaSelecthProps
) => {
  const { run } = uesRequest('system', 'areaList')
  const props = { ...defaultProp, ...areaSelecthProps }
  const [selectVal, setSelectVal] = useState<Array<any>>([])

  const {
    form,
    province,
    city,
    district,
    county,
    value,
    onChange,
    ...restProps
  } = props
  let areaLevel = -1
  if (province) {
    areaLevel += 1
  }
  if (city) {
    areaLevel += 1
  }
  if (district) {
    areaLevel += 1
  }
  if (county) {
    areaLevel += 1
  }

  if (selectVal.length === 0 && value) {
    if (value) {
      for (let i = 0; i <= areaLevel; i++) {
        const text = form?.getFieldValue(fields[i] + 'Name')
        selectVal.push({
          value: value.substr(0, (i + 1) * 2),
          label: text,
          areaCode: value.substr(0, (i + 1) * 2),
          areaName: text,
        })
      }
    }
  }
  const valueChange = (v: any[], selectOptions: any[]) => {
    setSelectVal(v)
    const areaCode = v[v.length - 1]
    // const val = {};
    if (onChange) {
      onChange(areaCode, selectOptions)
    }
  }
  const params = useMemo(() => {
    return { parentCode: '0' }
  }, [])
  const onLoad = (data: AreaDataProps[]) => {
    if (Array.isArray(data)) {
      return data.map((item: any) => {
        if (areaLevel) {
          item.isLeaf = item.areaLevel === `${areaLevel}`
        } else {
          item.isLeaf = false
        }
        return item
      })
    }
    return null
  }

  return (
    <ScCascader
      // @ts-ignore
      allowClear={false}
      textField="areaName"
      params={params}
      // @ts-ignore
      onChange={valueChange}
      asyn
      pIdField="parentCode"
      onLoad={onLoad}
      valueField="areaCode"
      request={run}
      options={[]}
      autoload
      value={selectVal}
      {...restProps}
    ></ScCascader>
  )
}

export default AareSelect
