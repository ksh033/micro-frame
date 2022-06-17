import { Input, InputNumber, Radio, RadioChangeEvent } from 'antd';
import React from 'react';

type SetGoodsCountValueType = {
  isShowAll: boolean;
  goods_number?: number;
};

type SetGoodsCountProps = {
  value?: SetGoodsCountValueType;
  onChange?: (val: SetGoodsCountValueType) => void;
};

const SetGoodsCount: React.FC<SetGoodsCountProps> = (props) => {
  const { value, onChange } = props;

  const onHandleChange = (e: RadioChangeEvent) => {
    onChange?.({
      isShowAll: e.target.value,
      goods_number: void 0,
    });
  };

  const onHandleInputChange = (num: number) => {
    onChange?.({
      isShowAll: value?.isShowAll || false,
      goods_number: num,
    });
  };

  return (
    <Radio.Group onChange={onHandleChange} value={props.value?.isShowAll}>
      <Radio value={false}>
        <InputNumber
          style={{ width: 100, marginLeft: 4 }}
          placeholder="自定义"
          controls={false}
          value={value?.goods_number}
          max={100}
          onChange={onHandleInputChange}
          parser={(text) => (/^\d+$/.test(text || '') ? Number(text) : 0)}
        />
      </Radio>
      <Radio value={true}>全部</Radio>
    </Radio.Group>
  );
};

export default SetGoodsCount;
