import { useMemo } from 'react'
import { ScSelect } from '@scboson/sc-element'
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

export interface BrandSelectProps extends FormComponentProps {
  value?: any
  onChange?: any
  limit?: number
}

const BrandSelect: FormComponent<BrandSelectProps> = (props) => {
  const { readonly, initialValues, limit, ...restProps } = props
  const { run } = uesRequest('system', 'barndList')

  const params = useMemo(
    () => ({
      size: props.limit || 15,
    }),
    [props.limit]
  )

  if (readonly) {
    return <div>{initialValues.brandName}</div>
  }

  return (
    <ScSelect
      {...restProps}
      params={params}
      request={run}
      remoteSearch={true}
      showSearch={true}
      autoload={true}
      searchField="brandName"
      placeholder="请选择/请输入"
      textField="brandName"
      valueField="brandName"
      filterOption={false}
      defaultActiveFirstOption={false}
      allowClear
    />
  )
}
BrandSelect.customView = true

export default BrandSelect
