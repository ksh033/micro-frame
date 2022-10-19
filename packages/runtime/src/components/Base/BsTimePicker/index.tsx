import React from 'react';
import { TimePicker, TimePickerProps } from 'antd';
import {
  FormComponentProps,
  FormComponent,
} from '@scboson/sc-element/es/c-form';
import moment from 'moment';

type BsTimePicker = Omit<TimePickerProps, 'value' | 'onChange' | 'format'> &
  FormComponentProps & {
    value?: string;
    onChange?: (val: string) => void;
    format?: string;
  };

const BsTimePicker: FormComponent<BsTimePicker> = (props) => {
  const {
    format = 'HH:mm:ss',
    value,
    onChange,
    readonly,
    form,
    initialValues,
    name,
    formItemProps,
    fieldProps,
    ...resProps
  } = props;

  const handleChange = (time: moment.Moment | null, timeString: string) => {
    onChange?.(timeString);
  };

  if (readonly) {
    return <span>{value}</span>;
  }

  return (
    <TimePicker
      {...resProps}
      format={format}
      value={moment(value, format)}
      onChange={handleChange}
    ></TimePicker>
  );
};

BsTimePicker.customView = true;

export default BsTimePicker;
