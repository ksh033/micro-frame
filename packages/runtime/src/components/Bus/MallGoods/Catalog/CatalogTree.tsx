import React, { useMemo } from "react";
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
  ...restProps
}) => {
    //const api = uesRequest("mallgoods_catalog", "list");

    const { run, loading } = uesRequest("mallgoods_catalog", "treeList");

    const [expandedKeys, setExpandedKeys] = useSessionStorageState<React.Key[]>(
      `${window.location.pathname}_expandedKeys`,
      ["0"]
    );
    const [catalogId, setCatalogId] = useSessionStorageState<string>(
      `${window.location.pathname}_selectedKeys`,
      ""
    );
    const [catalogNode, setCatalogNode] = useSessionStorageState<any>(
      `${window.location.pathname}_selectedRows`,
      ""
    );

    const loadDataPramsFormat = (item: any) => {
      return {
        //parentId: item.catalogId,
        parentId: item.catalogId || "0",
      };
    };
    if (selectKeysRef) {
      selectKeysRef(catalogId);
    }

    return (
      <ScTree
        {...restProps}
        expandedKeys={expandedKeys}
        root={{
          catalogId: "0",
          catalogName: "请选择品目",
          isLeaf: false,
          key: "0",
        }}
        selectedKeys={selectedKeys || [catalogId]}
        onExpand={(expandedKeys) => {
          setExpandedKeys(expandedKeys);
        }}
        onSelect={(selectedKeys: any, info) => {
          let [key] = info.selectedNodes.map((node) => {
            return node.key;
          });
          if (key) {
            if (key == "0") {
              key = "";
            } else {
              key = key + "";
            }
          } else {
            key = "";
          }
          if (cache) {
            setCatalogId(key);
            setCatalogNode(info.node)
          }

          onSelect && onSelect(selectedKeys, info);
        }}
        autoload={true}
        canSearch={false}
        async={false}
        params={{}}
        placeholder={"search"}
        // loadDataPramsFormat={loadDataPramsFormat}
        request={run}
        textField="catalogName"
        valueField="catalogId"
      />
    );
  };

export default CatalogTree;
