import React, { useMemo } from 'react';
import { uesRequest } from '../../../utils/api';
import BsTable from '../../Base/BsTable';
import BsSearch from '../../Base/BsSearch';
import list from './list';
import type { PageConfig } from '@scboson/sc-schema';
import { useListPageContext } from '@scboson/sc-schema';
import { ListPage } from '@scboson/sc-schema';
import userDictModel from '../../../components/Dict/userDictModel';
import { Tag } from 'antd';

const pagaConfig: PageConfig = {
  ...list,
};
const Table = (props: any) => {
  const { pageProps } = props;
  const {
    selectionType,
    onTabelRow,
    rowKey,
    selectedRowKeys,
    getCheckboxProps,
    params
  } = pageProps;

  const { run } = uesRequest('system', 'shop');
  const page = useListPageContext();
  const search = page.getSearch({});
  const searchConfig = search.toConfig();
  const { getDistList } = userDictModel();

  const shopBusinessMap = useMemo(() => {
    const rlist = getDistList({
      dictTypeCode: 'shopBusiness',
    });
    const map = new Map();
    if (Array.isArray(rlist)) {
      rlist.forEach((item) => {
        map.set(item.value, item.name);
      });
    }
    return map;
  }, [getDistList]);

  const pageInfo: any = page
    .getTable()
    .changeCol('shopName', {
      render(val: any, record: any) {
        if (record.enabled) {
          return val
        }
        return <>{val}<Tag color='red'>已关店</Tag></>
      }
    })
    .changeCol('shopBusiness', {
      render: (text: string, record: any) => {
        const rlist = record.shopBusinessList;
        let str = Array.isArray(rlist)
          ? rlist
            .map((item) => {
              return shopBusinessMap.get(item);
            })
            .join('，')
          : '--';
        if (str === '') {
          str = '--';
        }
        return str;
      },
    })
    .toConfig();
  const nParams = useMemo(() => {
    return {
      ...params,
      ...pageInfo.params,
      orders: [
        {
          "asc": false,
          "column": "enabled"
        }
      ],
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
          getCheckboxProps: getCheckboxProps ? getCheckboxProps : (record: any) => ({
            disabled: record.enabled === false, // Column configuration not to be checked
            // name: record.name,
          }),
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
const ShopTableTable: React.FunctionComponent<any> = ListPage(
  Table,
  pagaConfig
);

export default ShopTableTable;
