import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../stores';
import './PanelList.less';
import {
  SortableContainer,
  SortableElement,
  SortEnd,
} from 'react-sortable-hoc';
import { Button, Popconfirm, Space } from 'antd';
import { CopyOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
// @ts-ignore
import { ComponentSchemaProps } from '@scvisual/element';

const SortableItem: any = SortableElement((props: any) => {
  const { value, onCopy, onDelete, indexNmu } = props;

  return (
    <div className="deco-editor-card-item">
      <div className="decorate-component-coms-manager-child">
        <div className="decorate-component-coms-manager-child-layout">
          <MenuOutlined className="child-icons" />
          <span className="name-layout">
            {indexNmu + 1}.{value.cmpName}
          </span>
        </div>
        <div className="decorate-component-coms-manager-child-icons">
          <Space>
            <CopyOutlined className="child-icons" onClick={onCopy} />
            <Popconfirm
              title="确定删除组件？"
              placement="left"
              onConfirm={onDelete}
              okText="删除"
              cancelText="取消"
            >
              <DeleteOutlined className="child-icons" />
            </Popconfirm>
          </Space>
        </div>
      </div>
    </div>
  );
});

const SortableList: any = SortableContainer(
  (props: { children?: any; confirm?: any; showClearAction: boolean }) => {
    const { confirm, showClearAction = false } = props;
    return (
      <div>
        {showClearAction ? (
          <div className="clear-action">
            <Popconfirm
              title="确定清除组件？"
              placement="left"
              onConfirm={confirm}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link">清除组件</Button>
            </Popconfirm>
          </div>
        ) : null}

        <div>{props.children}</div>
      </div>
    );
  },
);

const PanelList: React.FC<any> = (props) => {
  const { comsStore, editorStore } = useStore();

  const editList = editorStore.editList;

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    editorStore.arrayMove(oldIndex, newIndex);
  };

  const onCopy = (value: ComponentSchemaProps) => {
    const flag = comsStore.addComsNum(value.cmpKey);
    if (flag) {
      editorStore.copyCmp(value);
    }
  };

  const onDelete = (value: ComponentSchemaProps) => {
    const flag = comsStore.minusComsNum(value.cmpKey);
    if (flag) {
      editorStore.deleteCmp(value.id);
    }
  };
  // 清空组件
  const clearConfirm = () => {
    comsStore.clearNum();
    editorStore.clearAllCmp();
  };

  return (
    <SortableList
      onSortEnd={onSortEnd}
      distance={10}
      confirm={clearConfirm}
      showClearAction={editList.length > 0}
    >
      {editList.map((value, index) => (
        <SortableItem
          key={`item-${value.id}`}
          index={index}
          value={value}
          indexNmu={index}
          onCopy={() => {
            onCopy(value);
          }}
          onDelete={() => {
            onDelete(value);
          }}
        />
      ))}
    </SortableList>
  );
};
export default observer(PanelList);
