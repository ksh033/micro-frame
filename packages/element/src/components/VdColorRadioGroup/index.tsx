import { InfoCircleOutlined } from '@ant-design/icons';
import { Radio, RadioGroupProps, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import React, { useMemo } from 'react';
import VdFormItem, { ExtendVdFormItemProps } from '../VdFormItem';
import './index.less';

export interface VdColorRadioGroupOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  tip?: string;
}

type VdColorRadioGroupProps = Omit<RadioGroupProps, 'options'> &
  ExtendVdFormItemProps & {
    options?: Array<VdColorRadioGroupOptionType | string | number>;
  };

const VdColorRadioGroup: React.FC<VdColorRadioGroupProps> = (props) => {
  const { onChange, value, options = [], formItem, block = false } = props;
  const valueMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(options)) {
      options.forEach((it: any) => {
        map.set(it.value, it.label);
      });
    }
    return map;
  }, [JSON.stringify(options)]);

  return (
    <VdFormItem
      formItem={formItem}
      valueName={valueMap.get(value) ? valueMap.get(value) : ''}
      block={block}
    >
      <Radio.Group
        onChange={onChange}
        value={value}
        className="vd--color-radio-group"
        size="large"
      >
        {options.map((it: any) => {
          return (
            <Radio.Button
              value={it.value}
              key={it.value}
              style={{ backgroundColor: it.color }}
              className="vd--color-radio-group-item"
            ></Radio.Button>
          );
        })}
      </Radio.Group>
    </VdFormItem>
  );
};

export default VdColorRadioGroup;
