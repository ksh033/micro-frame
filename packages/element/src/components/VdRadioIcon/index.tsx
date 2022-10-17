import { Button, Radio, RadioGroupProps, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useMemo } from 'react';
import VdFormItem, { ExtendVdFormItemProps } from '../VdFormItem';
import VdIcon from '../VdIcon';
import './index.less';

type VdRadioIconProps = RadioGroupProps &
  ExtendVdFormItemProps & {
    lineBlock?: boolean;
  };

const style = {
  fontSize: '20px',
  verticalAlign: 'text-top',
};

const VdRadioIcon: React.FC<VdRadioIconProps> = (props) => {
  const {
    onChange,
    value,
    options = [],
    formItem,
    block = false,
    lineBlock = false,
    showValue = true,
  } = props;
  const valueMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(options)) {
      options.forEach((it: any) => {
        map.set(it.value, it.text);
      });
    }
    return map;
  }, [JSON.stringify(options)]);

  const style: React.CSSProperties = {};
  if (lineBlock) {
    style.width = Math.floor(100 / options.length) + '%';
  }

  return (
    <VdFormItem
      formItem={formItem}
      valueName={valueMap.get(value) ? valueMap.get(value) : ''}
      showValue={showValue}
      block={block}
    >
      <div className="deco-radio-button-group">
        {options.map((it: any) => {
          return (
            <Tooltip
              title={it.text}
              key={`tooltip-${it.value}`}
              placement="bottom"
              color="#fff"
              mouseLeaveDelay={0.01}
              overlayInnerStyle={{
                color: '#323233',
              }}
              trigger={['hover', 'click']}
            >
              <Button
                className={[
                  'deco-radio-button',
                  it.value === value ? 'deco-radio-button--active' : '',
                ].join(' ')}
                value={it.value}
                key={it.value}
                style={style}
                onClick={() => {
                  onChange?.(it.value);
                }}
              >
                {it.icon ? (
                  React.isValidElement(it.icon) ? (
                    React.cloneElement(it.icon, {
                      style,
                    })
                  ) : (
                    <VdIcon
                      type={it.icon}
                      style={{
                        fontSize: it.fontSize || '20px',
                      }}
                    ></VdIcon>
                  )
                ) : (
                  <span className="deco-radio-text">{it.text}</span>
                )}
              </Button>
            </Tooltip>
          );
        })}
      </div>
    </VdFormItem>
  );
};

export default VdRadioIcon;
