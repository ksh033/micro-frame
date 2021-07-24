import React from "react";


import { uesRequest } from "../../../../utils/api";
import { ScTree } from "@scboson/sc-element";
import type { ScTreeProps } from "@scboson/sc-element/es/sc-tree/typing";

import { ScCard } from "@scboson/sc-layout";

const GoodsCatalogTree: React.FC<ScTreeProps> = (props) => {
  const api = uesRequest("mall", "goodsCatalogList");
  const loadDataPramsFormat = (item: any) => {
    return {
      parentId: item.goodsCatalogId,
    };
  };

  return (
    <ScCard style={{ minHeight: 300 }}>
      <ScTree
        {...props}
        canSearch={false}
        placeholder={"search"}
        async={true}
        showLine={true}
        loadDataPramsFormat={loadDataPramsFormat}
        autoload={true}
        request={api.run}
        params={{ parentId: "0" }}
        textField="catalogName"
        valueField="goodsCatalogId"
      />
    </ScCard>
  );
};

export default GoodsCatalogTree;
