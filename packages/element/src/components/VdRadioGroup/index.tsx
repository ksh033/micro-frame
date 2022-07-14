import { InfoCircleOutlined } from '@ant-design/icons';
import { Radio, RadioGroupProps, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import React, { useMemo } from 'react';
import VdFormItem, { ExtendVdFormItemProps } from '../VdFormItem';
import './index.less';

export interface VdRadioGroupOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  tip?: string;
}

type VdRadioGroupProps = Omit<RadioGroupProps, 'options'> &
  ExtendVdFormItemProps & {
    options?: Array<VdRadioGroupOptionType | string | number>;
  };

const VdRadioGroup: React.FC<VdRadioGroupProps> = (props) => {
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
      showValue={false}
      block={block}
    >
      <Radio.Group onChange={onChange} value={value} className="vd-radio-group">
        {options.map((it: any) => {
          return (
            <Radio value={it.value} key={it.value}>
              <span>
                {it.label}{' '}
                {it.tip ? (
                  <Tooltip placement="top" title={it.tip}>
                    <InfoCircleOutlined />
                  </Tooltip>
                ) : null}
              </span>
            </Radio>
          );
        })}
      </Radio.Group>
    </VdFormItem>
  );
};

export default VdRadioGroup;
