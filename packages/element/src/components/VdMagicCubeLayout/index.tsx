import _ from 'lodash';
import React from 'react';
import VdFormItem, { VdFormItemProps } from '../VdFormItem';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { InputNumber, Slider, SliderSingleProps, Space } from 'antd';

export type VdMagicCubeLayoutProps = VdFormItemProps & {
  value: any;
  onChange: (val: any) => void;
};

const VdMagicCubeLayout: React.FC<VdMagicCubeLayoutProps> = (props) => {
  const { formItemTitle, ...rest } = props;

  const [inputValue, setInputValue] = useMergedState('', {
    value: props.value,
    onChange: props.onChange,
  });
  const handleChange = (val: number) => {
    setInputValue(val);
  };

  return (
    <VdFormItem
      formItemTitle={formItemTitle}
      showValue={false}
      block={true}
    ></VdFormItem>
  );
};

export default VdMagicCubeLayout;
