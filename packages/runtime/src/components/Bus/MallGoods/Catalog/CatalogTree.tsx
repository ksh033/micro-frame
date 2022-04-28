import React, { useMemo } from 'react';
import { ScTree } from '@scboson/sc-element';

import type { ScTreeProps } from '@scboson/sc-element/es/sc-tree/typing';

import {  uesRequest } from '../../../../utils/service';

/**
 * 
 * 商品品目
 * @returns 
 */
const CatalogTree: React.FC<ScTreeProps> = ({ onSelect, params, ...restProps }) => {
    const api = uesRequest('mallgoods_catalog','list');
    const loadDataPramsFormat = (item: any) => {


        return {
            //parentId: item.catalogId,
            parentId: item.catalogId || '0',
        };
    };

    return (
        <ScTree
            {...restProps}
            defaultExpandedKeys={['0']}
            root={{
                catalogId: '0',
                catalogName: '请选择品目',
                key: '0',
            }}
            autoload={false}
            canSearch={false}
            placeholder={'search'}
            async={true}
            showLine={true}
            loadDataPramsFormat={loadDataPramsFormat}
            request={api.run}
            params={params}
            textField="catalogName"
            valueField="catalogId"
            onSelect={onSelect}
        />
    );
};

export default CatalogTree;
