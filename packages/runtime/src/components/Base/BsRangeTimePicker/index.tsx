/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */

import {
  FormComponent,
  FormComponentProps,
} from "@scboson/sc-element/es/c-form";
import { Form, Input, TimePicker } from "antd";
import { TimeRangePickerProps } from "antd/es/time-picker";
import { RangeValue } from "rc-picker/es/interface";
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const { RangePicker } = TimePicker;

export interface BsRangeTimePickerProps
  extends TimeRangePickerProps,
  FormComponentProps {
  format?: string;
  returnType?: "string" | "date";
  startTimeFiled?: string;
  endTimeFiled?: string;
  rulesRequire?: boolean;
  onChange?: (dates: RangeValue<Dayjs>, dateStrings: [string, string]) => void;
}

const BsRangeTimePicker: FormComponent<BsRangeTimePickerProps> = (props) => {
  const {
    format = "HH:mm",
    returnType = "string",
    startTimeFiled = "startTime",
    endTimeFiled = "endTime",
    form,
    readonly,
    initialValues,
    rulesRequire = false,
    onChange,
    ...resProps
  } = props;

  const [currentValue, setCurrentValue] = useState<any>();

  const formatValue = (): void => {
    const startTime = form?.getFieldValue(startTimeFiled);
    const endTime = form?.getFieldValue(endTimeFiled);
    if (startTime && endTime) {
      setCurrentValue([dayjs(startTime, format), dayjs(endTime, format)]);
    } else {
      setCurrentValue([]);
    }
  };

  useEffect(() => {
    formatValue();
  }, [form?.getFieldValue(startTimeFiled)]);

  const initialValue = useMemo(() => {
    if (
      initialValues &&
      initialValues[startTimeFiled] &&
      initialValues[endTimeFiled]
    ) {
      return [
        dayjs.utc(initialValues[startTimeFiled], format),
        dayjs.utc(initialValues[endTimeFiled], format),
      ];
    }
    return [];
  }, initialValues);

  const handleChange = (
    dates: RangeValue<Dayjs>,
    dateStrings: [string, string]
  ) => {
    const _dates: {
      [key: string]: string | Date;
    } = {};
    const _dateStrings: {
      [key: string]: string;
    } = {};
    if (Array.isArray(dates)) {
      if (returnType === "date") {
        _dates[`${startTimeFiled}`] = dayjs(dates[0]).toDate();
        _dates[`${endTimeFiled}`] = dayjs(dates[1]).toDate();
      }
      if (returnType === "string") {
        _dates[`${startTimeFiled}`] = dateStrings[0];
        _dates[`${endTimeFiled}`] = dateStrings[1];
      }
    }
    _dateStrings[`${startTimeFiled}`] = dateStrings[0];
    _dateStrings[`${endTimeFiled}`] = dateStrings[1];
    form?.setFieldsValue(_dateStrings);
    onChange && onChange(dates, dateStrings);
    formatValue();
  };

  const formatValueView = () => {
    const startTime = form?.getFieldValue(startTimeFiled);
    const endTime = form?.getFieldValue(endTimeFiled);
    const startTimeView = dayjs(startTime).format(format);
    const endTimeView = dayjs(endTime).format(format);

    if (startTimeView && endTimeView) {
      return (
        <div>
          {startTimeView} - {endTimeView}
        </div>
      );
    } else {
      return <div></div>;
    }
  };
  if (readonly) {
    return formatValueView();
  } else {
    return (
      <Form.Item noStyle>
        <div style={{ display: "none" }}>
          <Form.Item name={startTimeFiled} style={{ display: "none" }}>
            <Input></Input>
          </Form.Item>
          <Form.Item name={endTimeFiled} style={{ display: "none" }}>
            <Input></Input>
          </Form.Item>
        </div>
        <Form.Item
          noStyle
          initialValue={initialValue}
          rules={
            rulesRequire === true
              ? [
                {
                  required: true,
                  message: "请选择",
                },
              ]
              : undefined
          }
        >
          <RangePicker
            {...resProps}
            format={format}
            onChange={handleChange}
            value={currentValue}
          />
        </Form.Item>
      </Form.Item>
    );
  }
};

BsRangeTimePicker.customView = true;

export default BsRangeTimePicker;
