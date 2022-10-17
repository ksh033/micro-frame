import { Button, Input, Select, Space, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import './index.less';
import { useUpdateEffect } from 'ahooks';
// import { BsUpload } from '@micro-frame/sc-runtime';

export type TagItemState = {
  title?: string;
  position_component?: string;
  image_width?: number;
  image_height?: number;
  image_url?: string;
  link_url?: string;
  use_link?: boolean;
  image_id?: string;
  image_thumb_url?: string;
};

export type TagItemProps = {
  type?: 'text' | 'imageText' | 'image';
  value?: TagItemState;
  onChange?: (val: TagItemState) => void;
};

const TagItem: React.FC<TagItemProps> = (props) => {
  const { type = 'text' } = props;

  const [value, setValue] = useMergedState(
    {},
    {
      value: props.value,
      onChange: props.onChange,
    }
  );
  const [switchVal, setSwitchVal] = useState<boolean>(
    Boolean(value?.use_link) || false
  );

  useUpdateEffect(() => {
    setSwitchVal(Boolean(value?.use_link) || false);
  }, [value?.use_link]);

  const onUploadChange = (val: any) => {
    const newVal = value || {};
    setValue({
      ...newVal,
      image_id: val.fileId,
      image_url: val.url,
      image_thumb_url: val.thumb_url,
      image_width: val.width,
      image_height: val.height,
    });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = value || {};
    const title = e.target.value;
    if (typeof title === 'string') {
      console.log({
        ...newVal,
        title: title,
      });
      setValue({
        ...newVal,
        title: title,
      });
    }
  };

  const onPositionComponent = (val: string) => {
    const newVal = value || {};
    setValue({
      ...newVal,
      position_component: val,
    });
  };

  const onSwitchValChange = (val: boolean) => {
    const newVal = value || {};
    setValue({
      ...newVal,
      use_link: val,
    });
  };

  return (
    <div className="tag-item-warp">
      {type === 'image' || type === 'imageText' ? (
        <div className="has-choosed-image">
          <img src={value?.image_url} className="tag-item-image"></img>
        </div>
      ) : null}

      <div className="tag-item-warp-content">
        <Space direction="vertical" className="tag-item-warp-space">
          {type === 'image' ? (
            <div className="tag-item-link">
              <div className="tag-item-link-title">切换为跳转链接</div>
              <Switch
                size="small"
                onChange={onSwitchValChange}
                checked={switchVal}
              />
            </div>
          ) : (
            <Space align="center" className="tag-item-warp-space">
              <span className="tag-item-warp-label">标签</span>
              <Input
                onChange={onInputChange}
                value={value?.title}
                className="tag-item-cmp"
              ></Input>
            </Space>
          )}
          {switchVal ? (
            <Space align="center" className="tag-item-warp-space">
              <span className="tag-item-warp-label">链接</span>
              <Button type="link">选择跳转到页面</Button>
            </Space>
          ) : (
            <Space align="center" className="tag-item-warp-space">
              <span className="tag-item-warp-label">定位</span>
              <Select
                className="tag-item-cmp"
                onChange={onPositionComponent}
                value={value?.position_component}
                allowClear
              ></Select>
            </Space>
          )}
        </Space>
      </div>
    </div>
  );
};

export default TagItem;
