import React from 'react';
import { ScTreeSelect } from '@scboson/sc-element';

import type { ScTreeSelectProps } from '@scboson/sc-element/es/sc-tree-select';

import { uesRequest } from '../../../../utils/api'



const GoodsCatalogTree: React.FC<ScTreeSelectProps> = (props) => {
  const api = uesRequest('mall', 'goodsCatalogList');
  const loadDataPramsFormat = (item: any) => {
    return {
      parentId: item.goodsCatalogId,
    };
  };
  
  return (
   
      <ScTreeSelect
      {...props}
        placeholder={'商品品目'}
        //@ts-ignore
        async={true}
        loadDataPramsFormat={loadDataPramsFormat}
        autoload={true}
        request={api.run}
        params={{ parentId: '0' }}
        textField="catalogName"
        valueField="goodsCatalogId"
      
      />
  
  );
};



export default GoodsCatalogTree;