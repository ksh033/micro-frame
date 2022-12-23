import React from 'react';
import { ScTreeSelect } from '@scboson/sc-element';

import type { ScTreeSelectProps } from '@scboson/sc-element/es/sc-tree-select/ScTreeSelect';

import { uesRequest } from '../../../../utils/api';

/**
 * 商品品目
 *
 * @param param0
 * @returns
 */
const CatalogTreeSelect: React.FC<
  ScTreeSelectProps & { selectLeaf: boolean }
> = ({ params, selectLeaf = true, autoload = true, ...restProps }) => {
  const { run, loading } = uesRequest('mallgoods_catalog', 'treeList');

  return (
    <ScTreeSelect
      loading={loading}
      showSearch
      treeNodeFilterProp={'title'}
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
      request={run}
      params={{}}
      textField="catalogName"
      valueField="catalogId"
      {...restProps}
    />
  );
};

export default CatalogTreeSelect;
