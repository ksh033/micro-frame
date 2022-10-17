import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import React from 'react';
import { VdFormItemProps } from '../VdFormItem';
import {
  SortableContainer,
  SortableElement,
  SortEnd,
} from 'react-sortable-hoc';
import { arrayMoveMutable } from 'array-move';
import './index.less';

type typeNode = 'tag' | 'card';

type VdAddListProps = VdFormItemProps & {
  addBtnText?: string | ((fields: any[]) => React.ReactNode);
  type?: typeNode;
  max?: number;
  groupTitle?: () => React.ReactNode;
  addRecord?: any;
  renderItem?: (it: any, index: number) => React.ReactNode;
  value?: any[];
  onChange?: (list: any[]) => void;
  rowKey?: string;
  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
};

const SortableItem: any = SortableElement((props: any) => {
  const { it, index, getRowKey, onHandleDetele, renderItem, onItemChange } =
    props;

  const key = it.key || index;
  return (
    <div>
      <div className="add-list-item" key={key}>
        <CloseCircleFilled
          className="card-item__delete"
          key={`close-${key}`}
          onClick={() => {
            onHandleDetele(getRowKey(it, index));
          }}
        />
        {renderItem
          ? renderItem({
              value: it,
              onChange: onItemChange,
            })
          : null}
      </div>
    </div>
  );
});

const SortableList: any = SortableContainer((props: any) => {
  return <div>{props.children}</div>;
});

const VdAddList: React.FC<VdAddListProps> = (props) => {
  const {
    addBtnText = '新增',
    max = 999,
    groupTitle,
    addRecord = {},
    renderItem,
    value = [],
    onChange,
    rowKey = 'key',
    content,
    title,
  } = props;

  const getRowKey = React.useMemo<any>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: any, index: number) =>
      (record as any)?.[rowKey as string] ?? index;
  }, [rowKey]);

  const [list, setList] = useMergedState<any[]>(value || [], {
    value: value || [],
    onChange: onChange,
    postState(val) {
      return val.map((it, index: number) => {
        if (it.key) {
          return it;
        }
        return {
          ...it,
          key: index + '',
        };
      });
    },
  });

  const handleAddClick = (record: any) => {
    if (Array.isArray(list) && list.length < max) {
      const newValue = [...value, record].map((it, index) => {
        return {
          key: index + '',
          ...it,
        };
      });
      onChange?.(newValue);
    }
  };

  const onItemChange = (record: any) => {
    if (Array.isArray(list)) {
      const newList = JSON.parse(JSON.stringify(list));
      const index = newList.findIndex(
        (it: any, index: number) => getRowKey(it, index) === getRowKey(record),
      );
      console.log(record);
      newList.splice(index, 1, record);
      setList(newList);
    }
  };

  const onHandleDetele = (key: string) => {
    if (Array.isArray(list)) {
      const newList = list.filter((it, index) => getRowKey(it, index) !== key);
      setList(newList);
    }
  };

  const defaultGroupTitle = () => {
    return (
      <div className="heard-group-title">
        <div className="heard-title-content">
          <div className="heard-title-label">{title}</div>
          {content ? (
            <div
              className="heard-title-label"
              style={{ marginTop: '10px', color: ' #969799' }}
            >
              {content}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    const newList = JSON.parse(JSON.stringify(list));
    arrayMoveMutable(newList, oldIndex, newIndex);
    console.log(newList);
    setList(newList);
  };

  let customTitle = groupTitle ? groupTitle() : null;

  if (title != null) {
    customTitle = defaultGroupTitle();
  }

  return (
    <>
      <div className="add-list--bg-colored">
        {customTitle !== null ? (
          <div className="add-list-title" key="title">
            {customTitle}
          </div>
        ) : null}
        <div
          className="add-list-content"
          style={{ marginTop: customTitle == null ? '0' : '12px' }}
        >
          <div className="deco-goods-list">
            <SortableList
              onSortEnd={onSortEnd}
              helperClass="sortable-list-tab"
              distance={12}
            >
              {list.map((it: any, index: number) => {
                return (
                  <div key={index}>
                    <SortableItem
                      key={`item-${index}`}
                      index={index}
                      it={it}
                      getRowKey={getRowKey}
                      onHandleDetele={onHandleDetele}
                      renderItem={renderItem}
                      onItemChange={onItemChange}
                    />
                  </div>
                );
              })}
            </SortableList>
            {list.length < max ? (
              <Button
                ghost
                key="addbtn"
                type="primary"
                onClick={() => handleAddClick(addRecord)}
                block
                icon={<PlusOutlined />}
              >
                {typeof addBtnText === 'string' ? addBtnText : addBtnText(list)}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default VdAddList;
