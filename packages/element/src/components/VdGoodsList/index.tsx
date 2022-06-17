import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import React from 'react';
import './index.less';
import { goodsList } from './list';

type VdGoodsListProps = {
  value: any[];
  onChange: (list: any[]) => void;
};

const VdGoodsList: React.FC<VdGoodsListProps> = (props) => {
  const { value, onChange } = props;

  const [list, setList] = useMergedState<any[]>(value || [], {
    value: value || [],
    onChange: onChange,
  });

  const handleAddClick = () => {
    if (list.length <= 20) {
      var num = Math.floor(Math.random() * 20);

      const item = goodsList[num];
      if (item) {
        const index = list.findIndex((it) => it.goodsId === item.goodsId);
        if (index === -1) {
          setList([...list, item]);
        } else {
          handleAddClick();
        }
      } else {
        handleAddClick();
      }
    }
  };

  const onHandleDetele = (key: string) => {
    const newList = list.filter((it) => it.goodsId !== key);
    setList(newList);
  };

  return (
    <div className="deco-goods-list">
      {list.map((it) => {
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
