import { Form } from 'antd';
import _ from 'lodash';
import React from 'react';
import './index.less';

export type VdFormItemProps = {
  formItemTitle?: string;
  valueName?: React.Key;
  showValue?: boolean;
  block?: boolean;
};

const VdFormItem: React.FC<VdFormItemProps> = (props) => {
  const { formItemTitle, valueName, showValue = true, block = false } = props;

  return (
    <Form.Item>
      <div
        className={
          block
            ? 'vd-component-warp vd-component-warp-block'
            : 'vd-component-warp'
        }
      >
        <div className="vd-component-warp-header">
          <span className="vd-component-warp__label">
            {formItemTitle || ''}
          </span>
          {showValue ? (
            <span className="vd-component-warp__value">{valueName}</span>
          ) : null}
        </div>
        <div className="vd-component-warp-content">{props.children}</div>
      </div>
    </Form.Item>
  );
};

export default VdFormItem;
