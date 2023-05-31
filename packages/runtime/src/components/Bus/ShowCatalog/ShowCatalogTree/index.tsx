import React from "react";
import { uesRequest } from "../../../../utils/api";
import { ScTree } from "@scboson/sc-element";
import type { ScTreeProps } from "@scboson/sc-element/es/sc-tree/typing";

import { ScCard } from "@scboson/sc-layout";
import { Spin } from "antd";
/**
 * @deprecated 废弃
 * @param props
 * @returns
 */
const GoodsCatalogTree: React.FC<
  ScTreeProps & { catalogType?: string; catalogScene?: string }
> = (props) => {
  const { catalogType, catalogScene, ...restProps } = props;
  const api = uesRequest("mall", "showCatalogList");
  const loadDataPramsFormat = (item: any) => {
    return {
      parentId: item.mallCatalogId,
    };
  };

  return (
    <ScCard style={{ minHeight: 350 }}>
      <Spin tip="加载中..." spinning={api.loading}>
        <ScTree
          {...restProps}
          canSearch={false}
          placeholder={"search"}
          async={true}
          showLine={true}
          loadDataPramsFormat={loadDataPramsFormat}
          autoload={true}
          request={api.run}
          params={{
            parentId: "0",
            catalogType: catalogType,
            bizScene: catalogScene,
          }}
          textField="classifyName"
          valueField="classifyId"
        />
      </Spin>
    </ScCard>
  );
};

export default GoodsCatalogTree;
