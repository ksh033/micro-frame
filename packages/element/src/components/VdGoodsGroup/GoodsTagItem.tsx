import React from 'react';
import VdIcon from '../VdIcon';

type GoodsTagItemProps = {
  value?: any;
  name: number | number[];
  remove: (index: number | number[]) => void;
};

const GoodsTagItem: React.FC<GoodsTagItemProps> = (props) => {
  const { remove, name, value } = props;
  return (
    <div className="goods-group-tag-item">
      <a className="deco-link-tag__content">{value?.title}</a>
      <div className="deco-link-tag__edit">
        <VdIcon type="deco-icon-edit"></VdIcon>
      </div>
      <div className="deco-link-tag__close" onClick={() => remove(name)}>
        <VdIcon type="deco-icon-delete"></VdIcon>
      </div>
    </div>
  );
};

export default GoodsTagItem;
