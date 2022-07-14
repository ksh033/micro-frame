import React from 'react';
import './GroupTitleStyle.less';

const GroupTitle: React.FC<any> = () => {
  return (
    <div className="goods-group-title">
      <div className="goods-group-title-content">
        <div className="goods-group-title-label">添加商品分组</div>
        <div
          className="goods-group-title-label"
          style={{ marginTop: '10px', color: ' #969799' }}
        >
          最多添加15个商品分组
        </div>
      </div>
    </div>
  );
};

export default GroupTitle;
