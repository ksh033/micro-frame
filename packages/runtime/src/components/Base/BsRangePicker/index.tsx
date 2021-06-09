/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react'
import { Form, Input } from 'antd'
import moment, { Moment } from 'moment'
import {
  FormComponentProps,
  FormComponent,
} from '@scboson/sc-element/es/c-form'
import { RangeValue } from 'rc-picker/es/interface'

import RangePicker from './RangePicker'

export interface ScRangePickerProps extends FormComponentProps {
  format?: string
  returnType?: 'string' | 'date'
  startTimeFiled?: string
  endTimeFiled?: string
  showTime?: boolean
  rulesRequire?: boolean
}

const ScRangePicker: FormComponent<ScRangePickerProps> = (props) => {
  const {
    format,
    returnType = 'string',
    startTimeFiled = 'startTime',
    endTimeFiled = 'endTime',
    showTime = true,
    form,
    readonly,
    initialValues,
    rulesRequire = false,
    ...resProps
  } = props

  const cformat = format || (showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
  const [currentValue, setCurrentValue] = useState<any>()

  const startTime = initialValues[`${startTimeFiled}`]

  const formatValue = (): void => {
    const startTime = form?.getFieldValue(startTimeFiled)
    const endTime = form?.getFieldValue(endTimeFiled)
    if (startTime && endTime) {
      form?.setFieldsValue({
        [`${startTimeFiled}_${endTimeFiled}`]: [
          moment.utc(startTime, cformat),
          moment.utc(endTime, cformat),
        ],
      })
      setCurrentValue([
        moment.utc(startTime, cformat),
        moment.utc(endTime, cformat),
      ])
    } else {
      form?.setFieldsValue({
        [`${startTimeFiled}_${endTimeFiled}`]: [],
      })
      setCurrentValue([])
    }
  }

  useEffect(() => {
    formatValue()
  }, [startTime])

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
        _dates[`${startTimeFiled}`] = moment.utc(dates[0]).toDate()
        _dates[`${endTimeFiled}`] = moment.utc(dates[1]).toDate()
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

    if (startTime && endTime) {
      const startTimeView = moment.utc(startTime).format(cformat)
      const endTimeView = moment.utc(endTime).format(cformat)
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
          name={`${startTimeFiled}_${endTimeFiled}`}
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
            format={cformat}
            onChange={handleChange}
            {...resProps}
            showTime={showTime}
          />
        </Form.Item>
      </Form.Item>
    )
  }
}

ScRangePicker.customView = true

export default ScRangePicker
