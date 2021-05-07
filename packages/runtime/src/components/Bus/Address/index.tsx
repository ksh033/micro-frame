import React from 'react'
import { Input, Form } from 'antd'
import { ValidateUtil } from '@scboson/sc-utils'
import {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form'
import AreaSelect, { AreaSelecthProps } from './AreaSelect'

const fields = ['province', 'city', 'district', 'county']

export interface AddressProp extends AreaSelecthProps, FormComponentProps {
  addressDetail?: string
  addressField?: string
  widthTop?: string
  widthBottom?: string
}

const Address: FormComponent<any> = (props: AddressProp) => {
  // const [val, setVal] = useState<any>({});
  const {
    form,
    province = true,
    city = true,
    district = true,
    county,
    addressDetail = true,
    addressField = 'addressDetail',
    readonly,
    initialValues,
    widthTop = '50%',
    widthBottom = '50%',
  } = props
  let valid = true
  const checkVal = (rule: any, v: any) => {
    const { field } = rule
    if (ValidateUtil.isEmpty(v)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      if (field === 'areaCode') {
        valid = false
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('请选择行政区划')
      }

      if (field === addressField && valid) {
        valid = false
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('请输入详细地址')
      }
    } else {
      valid = true
    }
    // if (!value || !value.addressDetail || ValidateUtil.isEmpty(value.addressDetail)) {
    // eslint-disable-next-line prefer-promise-reject-errors
    // return Promise.reject('请输入详细地址');
    // }
    return Promise.resolve()
  }

  const render = () => {
    if (readonly) {
      const addressValue = initialValues[addressField]

      return (
        <>{`${initialValues.province ? `${initialValues.province}` : ''}${
          initialValues.city ? `${initialValues.city}` : ''
        }${initialValues.district ? `${initialValues.district}` : ''}${
          initialValues.county ? `${initialValues.county}` : ''
        }-${addressValue || ''}`}</>
      )
    } else {
      return (
        <Form.Item noStyle>
          <Input.Group compact>
            <Form.Item
              noStyle
              name="areaCode"
              messageVariables={{ label: '行政区划' }}
              rules={[{ validator: checkVal }]}
            >
              <AreaSelect
                style={{ width: widthTop }}
                form={form}
                province={province}
                city={city}
                district={district}
                county={county}
                onChange={(value, items) => {
                  const formData = {}
                  items.forEach((v: string, i: number) => {
                    formData[fields[i]] = v
                  })

                  form?.setFieldsValue(formData)
                  // setVal(formData);
                }}
              ></AreaSelect>
            </Form.Item>
            {province ? (
              <Form.Item
                hidden
                noStyle
                name="province"
                style={{ display: 'none' }}
              >
                <Input></Input>
              </Form.Item>
            ) : null}
            {city ? (
              <Form.Item hidden noStyle name="city" style={{ display: 'none' }}>
                <Input></Input>
              </Form.Item>
            ) : null}
            {district ? (
              <Form.Item
                hidden
                noStyle
                name="district"
                style={{ display: 'none' }}
              >
                <Input></Input>
              </Form.Item>
            ) : null}
            {county ? (
              <Form.Item
                hidden
                noStyle
                name="county"
                style={{ display: 'none' }}
              >
                <Input></Input>
              </Form.Item>
            ) : null}
            {addressDetail ? (
              <Form.Item
                name={addressField}
                noStyle
                messageVariables={{ label: '详细地址' }}
                rules={[{ validator: checkVal }]}
              >
                <Input
                  placeholder="请输入详细地址"
                  style={{ width: widthBottom }}
                ></Input>
              </Form.Item>
            ) : null}
          </Input.Group>
        </Form.Item>
      )
    }
  }

  return <>{render()}</>
}
Address.customView = true
export default Address
