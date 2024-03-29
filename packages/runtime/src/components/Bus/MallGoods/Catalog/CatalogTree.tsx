import React from "react";
import { ScTree } from "@scboson/sc-element";
import type { ScTreeProps } from "@scboson/sc-element/es/sc-tree/typing";
import { uesRequest } from "../../../../utils/api";
import { useSessionStorageState } from "ahooks";
/**
 * 商品品目
 *
 * @returns
 */
const CatalogTree: React.FC<
  ScTreeProps & { selectKeysRef?: React.RefCallback<any>; cache?: boolean }
> = ({
  onSelect,
  selectKeysRef,
  params,
  cache = true,
  selectedKeys,
  request,
  ...restProps
}) => {
    const { run, loading } = uesRequest('mallgoods_catalog', 'treeList');

    const [expandedKeys, setExpandedKeys] = useSessionStorageState<React.Key[]>(
      `${window.location.pathname}_expandedKeys`,
     {defaultValue:['0']}
    );
    const [catalogId, setCatalogId] = useSessionStorageState<string>(
      `${window.location.pathname}_selectedKeys`,
      {defaultValue:''}
    );
    const [catalogNode, setCatalogNode] = useSessionStorageState<any>(
      `${window.location.pathname}_selectedRows`,
      {defaultValue:''}
    );

    if (selectKeysRef) {
      selectKeysRef(catalogId);
    }

    return (
      <ScTree
        expandedKeys={expandedKeys}
        root={{
          catalogId: '0',
          catalogName: '请选择品目',
          isLeaf: false,
          key: '0',
        }}
        selectedKeys={selectedKeys as string[] || [catalogId]}
        onExpand={(expandedKeys) => {
          setExpandedKeys(expandedKeys);
        }}
        onSelect={(selectedKeys: any, info: any) => {
          let [key] = info.selectedNodes.map((node) => {
            return node.key;
          });
          if (key) {
            if (key == '0') {
              key = '';
            } else {
              key = key + '';
            }
          } else {
            key = '';
          }
          if (cache) {
            setCatalogId(key);
            if (info.node.dataRef.catalogSource !== 'SUPPLY_CHAIN') {
              setCatalogNode(info.node);
            } else {
              setCatalogNode({})
            }
          }

          onSelect && onSelect(selectedKeys, info);
        }}
        autoload={true}
        canSearch={false}
        async={false}
        params={{}}
        placeholder={'search'}
        request={request || run}
        textField="catalogName"
        valueField="catalogId"
        {...restProps}
      />
    );
  };

export default CatalogTree;
