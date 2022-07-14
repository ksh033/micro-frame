import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { FormListFieldData } from 'antd/es/form/FormList';
import React from 'react';
import { VdFormItemProps } from '../VdFormItem';
import SetGoodsCount from './SetGoodsCount';
import './index.less';
import GoodsTagItem from './GoodsTagItem';

type typeNode = 'tag' | 'card';

type VdGoodsGroupProps = VdFormItemProps & {
  addBtnText?: string;
  type?: typeNode;
  max?: number;
  groupTitle?: () => React.ReactNode;
};

type VdGoodsGroupDataNode = {
  alias: 'q2phvc06';
  goods_count: number;
  title: string;
  tag_name?: string;
  id: number | string;
  subtitle: string;
  children: any[];
  isShowAll?: boolean;
};

const VdGoodsGroup: React.FC<VdGoodsGroupProps> = (props) => {
  const {
    addBtnText = '添加商品分组',
    formItem,
    type = 'card',
    max = 999,
    groupTitle,
  } = props;

  const fieldsFormat = (
    it: FormListFieldData,
    remove: (index: number | number[]) => void,
    itType: typeNode,
  ) => {
    const { name, ...restField } = it;
    if (itType === 'card') {
      return (
        <div className="goods-group-card-item" key={it.key}>
          <CloseCircleFilled
            className="card-item__delete"
            onClick={() => {
              remove(it.name);
            }}
          />
          <Form.Item
            {...restField}
            label="商品来源"
            shouldUpdate={(prevValues, curValues) =>
              prevValues.title !== curValues.title
            }
          >
            {({ getFieldValue }) => {
              const title: string =
                getFieldValue(['sub_entry', name, 'title']) || '';
              return <span>{title}</span>;
            }}
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, 'tag_name']}
            label="菜单名称"
            key={[name, 'tag_name'].join('-')}
          >
            <Input placeholder="最多14个字" maxLength={14} />
          </Form.Item>
          <Form.Item
            {...restField}
            name={[name, 'isShowAll']}
            label="显示个数"
            key={[name, 'isShowAll'].join('-')}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    value.isShowAll === false &&
                    Number(value.goods_number || 0) <= 0
                  ) {
                    return Promise.reject(new Error('请填写大于0的数字'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <SetGoodsCount />
          </Form.Item>
        </div>
      );
    } else {
      return (
        <Form.Item {...restField} name={name} key={it.key}>
          <GoodsTagItem
            key={it.key}
            name={it.name}
            remove={remove}
          ></GoodsTagItem>
        </Form.Item>
      );
    }
  };

  return (
    <>
      <div className="goods-group--bg-colored">
        <>{groupTitle ? groupTitle() : null}</>
        <Form.List name={formItem?.name || ''}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((it) => {
                return fieldsFormat(it, remove, type);
              })}
              {fields.length < max ? (
                <Button
                  ghost
                  key="btn"
                  className="goods-group-add-btn"
                  type="primary"
                  onClick={() =>
                    add({
                      alias: 's5vbc7wa',
                      id: 121558147,
                      timestamp: 1655429502304,
                      title: '最热商品',
                      tag_name: '最热商品',
                      type: 'tag',
                      url: 'https://h5.youzan.com/v2/showcase/tag?alias=s5vbc7wa',
                      isShowAll: {
                        isShowAll: true,
                        goods_number: 0,
                      },
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  {addBtnText}
                </Button>
              ) : null}
            </>
          )}
        </Form.List>
      </div>
    </>
  );
};

export default VdGoodsGroup;
