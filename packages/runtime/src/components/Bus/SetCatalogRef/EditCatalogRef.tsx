import { ScTree } from '@scboson/sc-element';
import { useRequest, useSetState, useUpdateEffect } from 'ahooks';
import { Button, Space, Spin } from 'antd';
import React, { Key, useEffect, useRef, useState } from 'react';
import ModalPageContainer from '../../../components/Base/Tpl/ModalPageTpl';
import { uesRequest } from '../../../utils/api';
import style from './index.less';

type EditCatalogRefProps = {
  close: () => void;
  pageProps: {
    params?: any;
    reload?: () => void;
    occupyRequest?: (params: any) => Promise<any>; // 请求数据的远程方法
    saveRequest?: (params: any) => Promise<any>; // 请求数据的远程方法
  };
};

type EditCatalogRefState = {
  expandAll: boolean;
  expandedKeys: Key[];
  treeData: any[];
};

const defaultRequest = new Promise((resolve) => {
  resolve(null);
});

const defaultOptions = { manual: true };

const EditCatalogRef: React.FC<EditCatalogRefProps> = (props) => {
  const allCatalog = uesRequest('catalog', 'allCatalog');
  const { pageProps, close } = props;
  const { occupyRequest, params = {}, saveRequest, reload } = pageProps;

  const occupyRequestRun = useRequest(
    occupyRequest || defaultRequest,
    defaultOptions
  );

  const saveRequestRun = useRequest(
    saveRequest || defaultRequest,
    defaultOptions
  );

  const [disableList, setDisableList] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const allKeys = useRef<Key[]>([]);
  const [state, setState] = useSetState<EditCatalogRefState>({
    expandAll: false,
    expandedKeys: [],
    treeData: [],
  });

  const getAllKeys = (list: any[], selectKeys: Key[]) => {
    if (Array.isArray(list)) {
      list.forEach((item: any) => {
        if (Object.prototype.toString.call(item) === '[object Object]') {
          if (Array.isArray(item.children) && item.children.length > 0) {
            getAllKeys(item.children, selectKeys);
          }
          selectKeys.push(item.catalogId);
        } else {
          selectKeys.push(item);
        }
      });
    }
  };

  useEffect(() => {
    allCatalog.run().then((res) => {
      if (res && Array.isArray(res.children)) {
        const keys: Key[] = [];
        getAllKeys(res.children, keys);
        allKeys.current = keys;
        setState({
          treeData: res.children,
        });
      }
    });
    occupyRequestRun.run(params).then((res) => {
      if (res) {
        if (Array.isArray(res.selectList)) {
          setSelectedKeys(res.selectList);
        }
        if (Array.isArray(res.disableList)) {
          setDisableList(res.disableList);
        }
      }
    });
  }, []);

  const setDisabled = (list: any[], setMap: Set<React.Key>) => {
    if (Array.isArray(list)) {
      return (list = list.map((item: any) => {
        item.disabled = setMap.has(item.catalogId);
        if (Array.isArray(item.children) && item.children.length > 0) {
          item.children = setDisabled(item.children, setMap);
        }
        return item;
      }));
    }
    return [];
  };
  useUpdateEffect(() => {
    const setMap = new Set(disableList);
    let newTreeData = JSON.parse(JSON.stringify(state.treeData));
    setDisabled(newTreeData, setMap);
  }, [disableList, state.treeData]);

  const handleClick = () => {
    if (!state.expandAll) {
      setState({
        expandAll: !state.expandAll,
        expandedKeys: allKeys.current,
      });
    } else {
      setState({
        expandAll: !state.expandAll,
        expandedKeys: [],
      });
    }
  };

  const onCheck = (
    checked:
      | {
          checked: Key[];
          halfChecked: Key[];
        }
      | Key[],
    e: any
  ) => {
    if (Array.isArray(checked) && Array.isArray(e.checkedNodes)) {
      const rCheckeds = e.checkedNodes
        .filter((item: any) => item.isLeaf)
        .map((item: any) => {
          return item.key;
        });
      setSelectedKeys(rCheckeds);
    }
  };
  const isLeafFormat = (data: any) => {
    if (Array.isArray(data.children)) {
      if (data.children.length === 0) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  };
  const modalButtons = [
    {
      text: '取消',
      onClick() {
        close?.();
      },
    },
    {
      text: '确定',
      type: 'primary',
      onClick() {
        saveRequestRun
          .run({
            catalogIdList: selectedKeys,
            ...params,
          })
          .then(() => {
            reload?.();
            close?.();
          });
      },
    },
  ];

  return (
    <Spin tip="Loading..." spinning={allCatalog.loading}>
      <ModalPageContainer title="修改关联品目" toolbar={modalButtons}>
        <div className={style['bs-edit-catalog-ref']}>
          <Space>
            <Button type="primary" onClick={handleClick}>
              {state.expandAll ? '收起全部品目' : '展开全部品目'}
            </Button>
          </Space>
          <ScTree
            checkable
            canSearch={false}
            placeholder={'search'}
            isLeafFormat={isLeafFormat}
            defaultExpandParent
            textField="catalogName"
            valueField="catalogId"
            data={state.treeData}
            onCheck={onCheck}
            checkedKeys={selectedKeys}
            expandedKeys={state.expandedKeys}
            onExpand={(expandedKeys: Key[]) => {
              setState({
                expandedKeys: expandedKeys,
              });
            }}
          />
        </div>
      </ModalPageContainer>
    </Spin>
  );
};

export default EditCatalogRef;
