import React from 'react'
import { Form, InputNumber, Input } from 'antd'
import {
  FormComponentProps,
  FormComponent,
} from '@scboson/sc-element/es/c-form'
import styles from './index.less'
import { NamePath } from 'antd/lib/form/interface'

interface VolumeProps extends FormComponentProps {
  onChange?: (val: any) => {}
  value?: any
  volume?: {
    length: NamePath
    width: NamePath
    height: NamePath
  }
}

const Volume: FormComponent<VolumeProps> = (props: any) => {
  const {
    readonly,
    initialValues,
    volume = {
      length: 'length',
      width: 'width',
      height: 'height',
    },
  } = props
  const inputNumberProps = {
    min: 1,
  }

  const getName = (str: NamePath) => {
    return Array.isArray(str) ? str.join('.') : str
  }

  if (readonly) {
    return (
      <div>
        {initialValues[getName(volume?.length)]} mm长 *{' '}
        {initialValues[getName(volume?.width)]} mm宽 *{' '}
        {initialValues[getName(volume?.height)]} mm高
      </div>
    )
  }

  return (
    <Form.Item noStyle>
      <Input.Group compact>
        <Form.Item
          name={volume?.length}
          rules={[{ required: true, message: '请输入长' }]}
        >
          <InputNumber {...inputNumberProps} placeholder="长 mm"></InputNumber>
        </Form.Item>
        <div className={styles['multiply']}>*</div>
        <Form.Item
          name={volume?.width}
          rules={[{ required: true, message: '请输入宽' }]}
        >
          <InputNumber {...inputNumberProps} placeholder="宽 mm"></InputNumber>
        </Form.Item>
        <div className={styles['multiply']}>*</div>
        <Form.Item
          name={volume?.height}
          rules={[{ required: true, message: '请输入高' }]}
        >
          <InputNumber {...inputNumberProps} placeholder="高 mm"></InputNumber>
        </Form.Item>
      </Input.Group>
    </Form.Item>
  )
}
Volume.customView = true

export default Volume
