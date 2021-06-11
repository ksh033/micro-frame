/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */

import React, { useState, useEffect } from 'react'
import { TimePicker, Form, Input } from 'antd'
import moment, { Moment } from 'moment'
import { RangeValue } from 'rc-picker/es/interface'
import { TimeRangePickerProps } from 'antd/lib/time-picker'
import {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form'

const { RangePicker } = TimePicker

export interface BsRangeTimePickerProps
  extends TimeRangePickerProps,
    FormComponentProps {
  format?: string
  returnType?: 'string' | 'date'
  startTimeFiled?: string
  endTimeFiled?: string
  rulesRequire?: boolean
}

const BsRangeTimePicker: FormComponent<BsRangeTimePickerProps> = (props) => {
  const {
    format = 'HH:mm',
    returnType = 'string',
    startTimeFiled = 'startTime',
    endTimeFiled = 'endTime',
    form,
    readonly,
    initialValues,
    rulesRequire = false,
    ...resProps
  } = props

  const [currentValue, setCurrentValue] = useState<any>()

  const formatValue = (): void => {
    const startTime = form?.getFieldValue(startTimeFiled)
    const endTime = form?.getFieldValue(endTimeFiled)
    if (startTime && endTime) {
      setCurrentValue([moment(startTime, format), moment(endTime, format)])
    } else {
      setCurrentValue([])
    }
  }

  useEffect(() => {
    formatValue()
  }, [form?.getFieldValue(startTimeFiled)])

  const handleChange = (
    dates: RangeValue<Moment>,
    dateStrings: [string, string]
  ) => {
    const _dates: {
      [key: string]: string | Date
    } = {}
    const _dateStrings: {
      [key: string]: string
    } = {}
    if (Array.isArray(dates)) {
      if (returnType === 'date') {
        _dates[`${startTimeFiled}`] = moment(dates[0]).toDate()
        _dates[`${endTimeFiled}`] = moment(dates[1]).toDate()
      }
      if (returnType === 'string') {
        _dates[`${startTimeFiled}`] = dateStrings[0]
        _dates[`${endTimeFiled}`] = dateStrings[1]
      }
    }
    _dateStrings[`${startTimeFiled}`] = dateStrings[0]
    _dateStrings[`${endTimeFiled}`] = dateStrings[1]
    form?.setFieldsValue(_dateStrings)
    formatValue()
  }

  const formatValueView = () => {
    const startTime = form?.getFieldValue(startTimeFiled)
    const endTime = form?.getFieldValue(endTimeFiled)
    const startTimeView = moment(startTime).format(format)
    const endTimeView = moment(endTime).format(format)

    if (startTimeView && endTimeView) {
      return (
        <div>
          {startTimeView} - {endTimeView}
        </div>
      )
    } else {
      return <div></div>
    }
  }
  if (readonly) {
    return formatValueView()
  } else {
    return (
      <Form.Item noStyle>
        <div style={{ display: 'none' }}>
          <Form.Item name={startTimeFiled} style={{ display: 'none' }}>
            <Input></Input>
          </Form.Item>
          <Form.Item name={endTimeFiled} style={{ display: 'none' }}>
            <Input></Input>
          </Form.Item>
        </div>
        <Form.Item
         
          noStyle
          rules={
            rulesRequire === true
              ? [
                  {
                    required: true,
                    message: '请选择',
                  },
                ]
              : undefined
          }
        >
          <RangePicker
            format={format}
            onChange={handleChange}
            {...resProps}
            value={currentValue}
          />
        </Form.Item>
      </Form.Item>
    )
  }
}

BsRangeTimePicker.customView = true

export default BsRangeTimePicker
