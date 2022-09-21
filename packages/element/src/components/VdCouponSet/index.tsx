import { Checkbox, InputNumber, Radio, Space } from 'antd';
import React from 'react';
import './index.less';

type VdCouponSetProps = {
  value?: any;
  onChange?: (val: any) => void;
};

const VdCouponSet: React.FC<VdCouponSetProps> = (props) => {
  const {
    value = {
      isShowAll: true,
    },
    onChange,
  } = props;

  const onHandleChange = (key: string, val: any) => {
    let newValue = {};
    if (value != null) {
      newValue = JSON.parse(JSON.stringify(value));
    }
    onChange?.({
      ...newValue,
      [key]: val,
    });
  };

  return (
    <div className="vd-coupon-set">
      <Space direction="vertical" className="vd-coupon-set-content" size={20}>
        <span className="vd-coupon-set__label">券活动数</span>
        <Radio.Group
          onChange={(e) => {
            e.target.value;
            onHandleChange('isShowAll', e.target.value);
          }}
          value={value?.isShowAll}
        >
          <Radio value={true}>全部</Radio>
          <Radio value={false}>
            <InputNumber
              style={{ width: 180, marginLeft: 4 }}
              placeholder="请输入显示的券活动数"
              controls={false}
              value={value?.coupon_num}
              max={10}
              onChange={(num: any) => {
                onHandleChange('coupon_num', num);
              }}
              parser={(text) => (/^\d+$/.test(text || '') ? Number(text) : 0)}
            />
          </Radio>
        </Radio.Group>
        <div className="vd-coupon-set-unshared">
          <Space>
            <span className="vd-coupon-set__label">隐藏不可分享的优惠券</span>
            <span>
              {Boolean(value?.hide_unshared_coupon) ? '隐藏' : '不隐藏'}
            </span>
          </Space>
          <div>
            <Checkbox
              checked={value?.hide_unshared_coupon}
              onChange={(e) => {
                onHandleChange('hide_unshared_coupon', e.target.checked);
              }}
            ></Checkbox>
          </div>
        </div>
      </Space>
    </div>
  );
};

export default VdCouponSet;
