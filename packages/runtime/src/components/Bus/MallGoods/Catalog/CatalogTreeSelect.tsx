import React from 'react';
import { ScTreeSelect } from '@scboson/sc-element';

import type { ScTreeSelectProps } from '@scboson/sc-element/es/sc-tree-select/ScTreeSelect';

import {  uesRequest } from '@/utils/service';

const CatalogTree: React.FC<ScTreeSelectProps> = ({ onSelect, params, ...restProps }) => {
    const { run, loading } = uesRequest('mallgoods_catalog', 'list');
    const loadDataPramsFormat = (item: any) => {
        return {
            //parentId: item.mallCatalogId,
            parentId: item.catalogId || '0',
        };
    };

    return (
        <ScTreeSelect
            {...restProps}

            loading={loading}
            root={{
                mallCatalogId: '0',
                catalogName: '请选择品目',
                key: '0',
            }}
            autoload={false}
            pIdField="parentId"
            loadDataPramsFormat={loadDataPramsFormat}
            request={run}
            params={params}
            textField="catalogName"
            valueField="catalogId"
        // onSelect={onSelect}
        />
    );
};

export default CatalogTree;
