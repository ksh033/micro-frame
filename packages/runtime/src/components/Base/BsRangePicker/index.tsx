/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/index';
import moment, { Moment } from 'moment';
import {
  FormComponentProps,
  FormComponent,
} from '@scboson/sc-element/es/c-form';
import { RangeValue } from 'rc-picker/es/interface';

import RangePicker from './RangePicker';
function disabledDate(current: any) {
  return current && current <= moment(new Date()).add(-1, 'days');
}

let start = moment().weekday(1).format('YYYY/MM/DD') //本周一
let end = moment().weekday(7).format('YYYY/MM/DD') //本周日
const RangePresetsTypeMap = {
  'preset1': {
    "当日": [moment().startOf('day'), moment().endOf('day')],
    "昨日": [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
    "本周": [moment().weekday(1).startOf('day'), moment().weekday(7).endOf('day')],
    "上周": [moment().week(moment().week() - 1).startOf('week').startOf('day'), moment().week(moment().week() - 1).endOf('week').endOf('day')],
    "本月": [moment().startOf('month').startOf('day'), moment().endOf('month').endOf('day')],
    "上月": [moment().subtract(1, 'month').startOf('month').startOf('day'), moment().subtract(1, 'month').endOf('month').endOf('day')],
    "过去7天": [moment().subtract(7, 'day').startOf('day'), moment().endOf('day')],
    "过去30天": [moment().subtract(30, 'day').startOf('day'), moment().endOf('day')],
    "过去90天": [moment().subtract(90, 'day').startOf('day'), moment().endOf('day')],
    "今年至今": [moment().startOf('year').startOf('day'), moment().endOf('day')]
  }

}
export type BsRangePickerProps = FormComponentProps &
  RangePickerProps & {
    format?: string;
    returnType?: 'string' | 'date';
    startTimeFiled?: string;
    endTimeFiled?: string;
    showTime?: Object | boolean;
    rulesRequire?: boolean;
    disabled?: boolean;
    disabledToday?: boolean;
    //预设类型
    presetType?: keyof typeof RangePresetsTypeMap
  };

const BsRangePicker: FormComponent<RangePickerProps & BsRangePickerProps> = (
  props
) => {
  const {
    format,
    returnType = 'string',
    startTimeFiled = 'startTime',
    endTimeFiled = 'endTime',
    showTime = format && format == "YYYY-MM-DD" ? false : true,
    disabledToday = false,
    form,
    readonly,
    initialValues,
    rulesRequire = false,
   // placeholder,
    onChange,
    ranges,
    presetType = "preset1",
    ...resProps
  } = props;

  const cformat = format || (showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');
  const [currentValue, setCurrentValue] = useState<any>();

  let temranges: any = ranges;

  if (!temranges && presetType) {

    temranges = RangePresetsTypeMap[presetType]
  }
  if (disabledToday === true) {
    resProps.disabledDate = disabledDate;
  }
  const formatValue = (): void => {
    const startTime = form?.getFieldValue(startTimeFiled);
    const endTime = form?.getFieldValue(endTimeFiled);
    if (startTime && endTime) {
      form?.setFieldsValue({
        [`${startTimeFiled}_${endTimeFiled}`]: [
          moment.utc(startTime, cformat),
          moment.utc(endTime, cformat),
        ],
      });
      setCurrentValue([
        moment.utc(startTime, cformat),
        moment.utc(endTime, cformat),
      ]);
    } else {
      form?.setFieldsValue({
        [`${startTimeFiled}_${endTimeFiled}`]: [],
      });
      setCurrentValue([]);
    }
  };

  const initialValue = useMemo(() => {
    if (
      initialValues &&
      initialValues[startTimeFiled] &&
      initialValues[endTimeFiled]
    ) {
      return [
        moment.utc(initialValues[startTimeFiled], cformat),
        moment.utc(initialValues[endTimeFiled], cformat),
      ];
    }
    return [];
  }, [initialValues]);

  useEffect(() => {
    formatValue();
  }, [form?.getFieldValue(startTimeFiled)]);

  const handleChange = (
    dates: RangeValue<Moment>,
    dateStrings: [string, string]
  ) => {
    const _dates: {
      [key: string]: string | Date | null;
    } = {};
    const _dateStrings: {
      [key: string]: any;
    } = {};
    let temStartTimeFiled, temEndTimeFiled;
    let temData = _dateStrings;
    if (Array.isArray(startTimeFiled)) {
      temStartTimeFiled = startTimeFiled[startTimeFiled.length - 1];
      temEndTimeFiled = endTimeFiled[endTimeFiled.length - 1];

      startTimeFiled.forEach((item, i) => {
        if (i < startTimeFiled.length - 1) {
          temData[item] = {};
          temData = temData[item];
        }
      });
    } else {
      temStartTimeFiled = startTimeFiled;
      temEndTimeFiled = endTimeFiled;
    }
    if (Array.isArray(dates)) {
      if (returnType === 'date') {
        _dates[`${temStartTimeFiled}`] = moment.utc(dates[0]).toDate();
        _dates[`${temEndTimeFiled}`] = moment.utc(dates[1]).toDate();
      }
      if (returnType === 'string') {
        _dates[`${temStartTimeFiled}`] = dateStrings[0];
        _dates[`${temEndTimeFiled}`] = dateStrings[1];
      }
    } else {
      _dates[`${temStartTimeFiled}`] = null;
      _dates[`${temEndTimeFiled}`] = null;
    }
    temData[`${temStartTimeFiled}`] = dateStrings[0];
    temData[`${temEndTimeFiled}`] = dateStrings[1];
    form?.setFieldsValue(_dateStrings);
    formatValue();
    onChange && onChange(dates, dateStrings);
  };

  const formatValueView = () => {
    const startTime = form?.getFieldValue(startTimeFiled);
    const endTime = form?.getFieldValue(endTimeFiled);

    if (startTime && endTime) {
      const startTimeView = moment.utc(startTime).format(cformat);
      const endTimeView = moment.utc(endTime).format(cformat);
      return (
        <div>
          {startTimeView} - {endTimeView}
        </div>
      );
    } else {
      return <div></div>;
    }
  };
  const newProps = useMemo(() => {
    return {
      ...resProps,
      ranges: temranges,
      showTime:
        typeof showTime === 'object' && showTime !== null
          ? showTime
          : typeof showTime === 'boolean' && showTime
            ? {
              hideDisabledOptions: true,
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss'),
              ],
            }
            : false,
    };
  }, [resProps, JSON.stringify(showTime)]);

  if (readonly) {
    return formatValueView();
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
          initialValue={initialValue}
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
            style={{ width: '100%' }}
            {...newProps}
          />
        </Form.Item>
      </Form.Item>
    );
  }
};

BsRangePicker.customView = true;

export default BsRangePicker;
