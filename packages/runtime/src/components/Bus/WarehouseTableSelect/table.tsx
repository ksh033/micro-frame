import React, { useMemo } from 'react';
import { uesRequest } from '../../../utils/api';
import BsTable from '../../Base/BsTable';
import BsSearch from '../../Base/BsSearch';
import list from './list';
import type { PageConfig } from '@scboson/sc-schema';
import { useListPageContext } from '@scboson/sc-schema';
import { ListPage } from '@scboson/sc-schema';

const pagaConfig: PageConfig = {
  ...list,
};

const Table: React.FC<any> = (props: any) => {
  const { pageProps } = props;
  const {
    selectionType,
    onTabelRow,
    rowKey,
    selectedRowKeys,
    rowSelection,
    needAll = true,
    params
  } = pageProps;
  const { run } = uesRequest('system', 'warehouse');

  const page = useListPageContext();
  const search = page.getSearch({});
  const searchConfig = search.toConfig();

  const pageInfo: any = page
    .getTable()
    .changeCol('detailAddress', {
      render: (text: string, record: any) => {
        const provinceName = record.provinceName || '';
        const cityName = record.cityName || '';
        const districtName = record.districtName || '';
        return `${provinceName}${cityName}${districtName}${record.detailAddress || ''
          }`;
      },
    })
    .toConfig();

  const nParams = useMemo(() => {
    return {
      needAll,
      ...params,
      ...pageInfo.params,
    };
  }, [JSON.stringify(pageInfo.params)]);
  return (
    <div style={{ padding: '20px' }}>
      <BsSearch {...searchConfig} />
      <BsTable
        {...pageInfo}
        checkbox
        rowSelection={{
          type: selectionType,
          ...(rowSelection || {}),
        }}
        autoload
        rowKey={rowKey}
        request={run}
        onSelectRow={onTabelRow}
        selectedRowKeys={selectedRowKeys}
        params={nParams}
        scroll={{ y: 240 }}
      />
    </div>
  );
};

const WarehouseTable: any = ListPage(Table, pagaConfig);
export default WarehouseTable;
