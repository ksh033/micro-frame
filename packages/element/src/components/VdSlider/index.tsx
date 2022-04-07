import _ from 'lodash';
import React from 'react';
import VdFormItem, { VdFormItemProps } from '../VdFormItem';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { InputNumber, Slider, SliderSingleProps, Space } from 'antd';

export type VdSliderProps = SliderSingleProps & VdFormItemProps;

const VdSlider: React.FC<VdSliderProps> = (props) => {
  const { formItemTitle, min = 0, max = 60, defaultValue = 0, ...rest } = props;

  const [inputValue, setInputValue] = useMergedState(defaultValue, {
    value: props.value,
    onChange: props.onChange,
  });
  const handleChange = (val: number) => {
    setInputValue(val);
  };

  return (
    <VdFormItem formItemTitle={formItemTitle} showValue={false}>
      <Space>
        <Slider
          min={min}
          max={max}
          onChange={handleChange}
          value={typeof inputValue === 'number' ? inputValue : 0}
          style={{ width: '200px' }}
          {...rest}
        />
        <InputNumber
          min={min}
          max={max}
          value={inputValue}
          onChange={handleChange}
          style={{ width: '60px' }}
          controls={false}
        />
      </Space>
    </VdFormItem>
  );
};

export default VdSlider;
