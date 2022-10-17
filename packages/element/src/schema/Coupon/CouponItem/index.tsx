import { MenuOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React from 'react';
import './index.less';

type CouponItemProps = {
  value: any;
};

const CouponItem: React.FC<CouponItemProps> = (props) => {
  const { value } = props;
  return (
    <div className="coupon-item" key={value.key}>
      <Space>
        <MenuOutlined />
        <span>
          优惠券：{value.name} {value.condition ? `(${value.condition})` : null}
        </span>
      </Space>
    </div>
  );
};

export default CouponItem;
