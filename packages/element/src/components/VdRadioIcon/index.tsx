import { Radio, RadioGroupProps, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useMemo } from 'react';
import VdFormItem, { VdFormItemProps } from '../VdFormItem';

type VdRadioIconProps = RadioGroupProps &
  VdFormItemProps & {
    block?: boolean;
  };

const VdRadioIcon: React.FC<VdRadioIconProps> = (props) => {
  const { onChange, value, options = [], formItemTitle, block = false } = props;
  const valueMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(options)) {
      options.forEach((it: any) => {
        map.set(it.value, it.text);
      });
    }
    return map;
  }, [JSON.stringify(options)]);

  return (
    <VdFormItem
      formItemTitle={formItemTitle}
      valueName={valueMap.get(value) ? valueMap.get(value) : ''}
      block={block}
    >
      <Radio.Group onChange={onChange} value={value} buttonStyle="solid">
        {options.map((it: any) => {
          return (
            <Tooltip
              title={it.text}
              key={`tooltip-${it.value}`}
              placement="bottom"
              color="#fff"
              overlayInnerStyle={{
                color: '#323233',
              }}
            >
              <Radio.Button value={it.value} key={it.value}>
                {it.icon
                  ? React.isValidElement(it.icon)
                    ? it.icon
                    : React.createElement(it.icon, it.iconProps)
                  : it.text}
              </Radio.Button>
            </Tooltip>
          );
        })}
      </Radio.Group>
    </VdFormItem>
  );
};

export default VdRadioIcon;
