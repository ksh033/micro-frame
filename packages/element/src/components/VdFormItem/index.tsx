import { Form } from 'antd';
import _ from 'lodash';
import React from 'react';
import './index.less';

export type VdFormItemProps = {
  formItemTitle?: string;
  valueName?: React.Key;
  showValue?: boolean;
};

const VdFormItem: React.FC<VdFormItemProps> = (props) => {
  const { formItemTitle, valueName, showValue = true } = props;

  return (
    <Form.Item>
      <div className="vd-component-warp">
        <div className="vd-component-warp-header">
          <span className="vd-component-warp__label">
            {formItemTitle || ''}
          </span>
          {showValue ? <span>{valueName}</span> : null}
        </div>
        {props.children}
      </div>
    </Form.Item>
  );
};

export default VdFormItem;
