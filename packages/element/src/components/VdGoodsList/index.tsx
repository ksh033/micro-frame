import React from 'react';
import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import './index.less';
import { goodsList } from './list';

type VdGoodsListProps = {
  value: any[];
  onChange: (list: any[]) => void;
};

const VdGoodsList: React.FC<VdGoodsListProps> = (props) => {
  const { value = [], onChange } = props;

  const handleAddClick = () => {
    if (Array.isArray(value) && value.length <= 20) {
      var num = Math.floor(Math.random() * 20);

      const item = goodsList[num];
      if (item) {
        const index = value.findIndex((it) => it.goodsId === item.goodsId);
        if (index === -1) {
          onChange?.([...value, item]);
        } else {
          handleAddClick();
        }
      } else {
        handleAddClick();
      }
    }
  };

  const onHandleDetele = (key: string) => {
    if (Array.isArray(value)) {
      const newList = value.filter((it) => it.goodsId !== key);
      onChange?.([...newList]);
    }
  };

  return (
    <div className="deco-goods-list">
      {value.map((it) => {
        return (
          <div className="deco-goods-list-item" key={it.goodsId}>
            <div>
              <img src=""></img>
            </div>
            <CloseCircleFilled
              className="deco-editor-list-item__delete"
              onClick={() => {
                onHandleDetele(it.goodsId);
              }}
            />
          </div>
        );
      })}
      <div
        className="deco-goods-list-item deco-goods-list-add-item"
        onClick={handleAddClick}
      >
        <PlusOutlined />
      </div>
    </div>
  );
};

export default VdGoodsList;
