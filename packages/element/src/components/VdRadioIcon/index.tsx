import { Button, Radio, RadioGroupProps, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useMemo } from 'react';
import VdFormItem, { ExtendVdFormItemProps } from '../VdFormItem';
import VdIcon from '../VdIcon';
import './index.less';

type VdRadioIconProps = RadioGroupProps & ExtendVdFormItemProps;

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
                    <VdIcon type={it.icon}></VdIcon>
                  )
                ) : (
                  <span className="deco-radio-text">{it.text}</span>
                )}
              </Button>
              {/* <Radio.Button value={it.value} key={it.value}>
                <span style={{ fontSize: '20px' }}>
                  {it.icon
                    ? React.isValidElement(it.icon)
                      ? React.cloneElement(it.icon, {
                          style,
                        })
                      : React.createElement(it.icon, {
                          style,
                          ...it.iconProps,
                        })
                    : it.text}
                </span>
              </Radio.Button> */}
              <span></span>
            </Tooltip>
          );
        })}
      </div>
      {/* <Radio.Group onChange={onChange} value={value} buttonStyle="solid">
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
              <Radio.Button value={it.value} key={it.value}>
                <span style={{ fontSize: '20px' }}>
                  {it.icon
                    ? React.isValidElement(it.icon)
                      ? React.cloneElement(it.icon, {
                          style,
                        })
                      : React.createElement(it.icon, {
                          style,
                          ...it.iconProps,
                        })
                    : it.text}
                </span>
              </Radio.Button>
            </Tooltip>
          );
        })}
      </Radio.Group> */}
    </VdFormItem>
  );
};

export default VdRadioIcon;
