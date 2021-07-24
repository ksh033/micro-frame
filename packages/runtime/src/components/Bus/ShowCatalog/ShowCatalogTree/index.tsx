import React from "react";
import { uesRequest } from "../../../../utils/api";
import { ScTree } from "@scboson/sc-element";
import type { ScTreeProps } from "@scboson/sc-element/es/sc-tree/typing";

import { ScCard } from "@scboson/sc-layout";

const GoodsCatalogTree: React.FC<ScTreeProps&{catalogType?:string}> = (props) => {
  const {catalogType,...restProps}=props
  const api = uesRequest('mall', 'showCatalogList');
  const loadDataPramsFormat = (item: any) => {
    return {
      parentId: item.mallCatalogId,
    };
  };

  return (
    <ScCard style={{ minHeight: 350 }}>
      <ScTree
        {...restProps}
        canSearch={false}
        placeholder={"search"}
        async={true}
        showLine={true}
        loadDataPramsFormat={loadDataPramsFormat}
        autoload={true}
        request={api.run}
        params={{ parentId: '0',catalogType:catalogType }}
        textField="catalogName"
        valueField="mallCatalogId"
      />
    </ScCard>
  );
};

export default GoodsCatalogTree;
