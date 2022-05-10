import React from "react";
import { ScTreeSelect } from "@scboson/sc-element";

import type { ScTreeSelectProps } from "@scboson/sc-element/es/sc-tree-select";

import { uesRequest } from "../../../../utils/api";
/**
 * @deprecated 废弃
 * @param props
 * @returns
 */
const ShowCatalogSelect: React.FC<
  ScTreeSelectProps & { catalogType?: string }
> = (props) => {
  const { catalogType, ...restProps } = props;
  const api = uesRequest("mall", "showCatalogList");
  const loadDataPramsFormat = (item: any) => {
    return {
      parentId: item.mallCatalogId,
    };
  };

  return (
    <ScTreeSelect
      placeholder={"商品展示分类"}
      {...restProps}
      //@ts-ignore
      async={true}
      loadDataPramsFormat={loadDataPramsFormat}
      autoload={true}
      request={api.run}
      params={{ parentId: "0", catalogType: catalogType }}
      textField="catalogName"
      valueField="mallCatalogId"
    />
  );
};

export default ShowCatalogSelect;
