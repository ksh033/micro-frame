import React from "react";
import { ScTreeSelect } from "@scboson/sc-element";

import type { ScTreeSelectProps } from "@scboson/sc-element/es/sc-tree-select/ScTreeSelect";

import { uesRequest } from "../../../../utils/api";

/**
 * 商品品目
 *
 * @param param0
 * @returns
 */
const CatalogTreeSelect: React.FC<
  ScTreeSelectProps & { selectLeaf: boolean }
> = ({ params, selectLeaf = true, ...restProps }) => {
  const { run, loading } = uesRequest("mallgoods_catalog", "treeList");
  const loadDataPramsFormat = (item: any) => {
    return {
      //parentId: item.mallCatalogId,
      parentId: item.catalogId || "0",
    };
  };

  return (
    <ScTreeSelect
      {...restProps}
      loading={loading}
      //   root={{
      //     mallCatalogId: "0",
      //     catalogName: "请选择品目",
      //     key: "0",
      //   }}
      showSearch
      treeNodeFilterProp={"title"}
      nodeTransform={(nodeData: any) => {
        if (selectLeaf) {
          let selectable = true;
          if (!nodeData.isLeaf) {
            selectable = false;
          }
          return { selectable };
        } else {
          return {};
        }
      }}
      treeDataSimpleMode
      autoload={true}
      // loadDataPramsFormat={loadDataPramsFormat}
      request={run}
      params={{}}
      textField="catalogName"
      valueField="catalogId"
    />
  );
};

export default CatalogTreeSelect;
