import { CModal } from '@scboson/sc-element';
import type { PageConfig } from '@scboson/sc-schema';
import { ListPage, useListPageContext } from '@scboson/sc-schema';
import { useRequest, useSetState, useUpdateEffect } from 'ahooks';
import { Alert } from 'antd';
import React, { useEffect, useMemo } from 'react';
import BsSearch from '../../Base/BsSearch';
import BsTable from '../../Base/BsTable';
import PageContainer from '../../Base/PageContainer';
import EditCatalogRef from './EditCatalogRef';
import style from './index.less';
import list from './list';

const pagaConfig: PageConfig = {
  service: {},
  ...list,
};

type SetCatalogRefProps = {
  request?: (params: any) => Promise<any>; // 请求数据的远程方法
  occupyRequest?: (params: any) => Promise<any>; // 请求数据的远程方法
  saveRequest?: (params: any) => Promise<any>; // 请求数据的远程方法
  nameField?: string;
  valueField?: string;
  params?: any;
};

const SetCatalogRef: React.FC<SetCatalogRefProps> = (props) => {
  const {
    request,
    nameField = 'stallName',
    valueField = 'stallId',
    occupyRequest,
    saveRequest,
    params: reqParams = {},
  } = props;
  const { loading, run } = useRequest(
    request ||
      new Promise((resolve) => {
        resolve(null);
      }),
    {
      manual: true,
    }
  );

  const page = useListPageContext();
  const search = page.getSearch({});
  const pageParams = page.getPageParam();
  const searchConfig = search.toConfig();

  const [state, setState] = useSetState<{
    update: boolean;
    expandedRowKeys: any[];
    dataSouce: any[];
  }>({
    update: false,
    expandedRowKeys: [],
    dataSouce: [],
  });

  const loadChildren = (record: any, root: boolean, level: number) => {
    const { catalogId, catalogName: catalogSearchKey } = record;
    let params = {};
    if (root) {
      params = { parentId: catalogId, catalogSearchKey };

      if (!catalogSearchKey && !catalogId) {
        params = { parentId: '0' };
      }
    } else {
      params = { parentId: catalogId };
    }
    run(params).then((data: any) => {
      if (data) {
        data.forEach((element: any) => {
          element.level = level + 1;
          if (!element.isLeaf) {
            element.children = [];
          } else {
            delete element.children;
          }
        });
      }
      const newexpandedRowKeys: any[] = [...state.expandedRowKeys, catalogId];
      if (!root) {
        record.children = JSON.parse(JSON.stringify(data));
        setState({
          update: !state.update,
          expandedRowKeys: newexpandedRowKeys,
          dataSouce: state.dataSouce,
        });
      } else {
        setState({
          update: !state.update,
          expandedRowKeys: newexpandedRowKeys,
          dataSouce: data,
        });
      }
    });
  };

  const pageInfo = page
    .getTable()
    .addButton({
      text: '修改关联品目',
      type: 'primary',
      onClick() {
        CModal.show({
          title: '修改关联品目',
          width: 1000,
          content: EditCatalogRef,
          okCancel: false,
          footer: null,
          pageProps: {
            occupyRequest,
            saveRequest,
            params: reqParams,
          },
        });
      },
    })
    .toConfig();

  const params = useMemo(() => {
    return { [valueField]: pageParams[valueField], ...pageInfo.params };
  }, [JSON.stringify(pageInfo.params)]);

  useEffect(() => {
    loadChildren(
      { [valueField]: pageParams[valueField], catalogId: '0' },
      true,
      0
    );
  }, []);

  useUpdateEffect(() => {
    loadChildren(params, true, 0);
  }, [params]);

  // const params = { ...pageInfo.params, parentId: '0' };
  console.log(pageInfo);
  return (
    <PageContainer title="关联货品品目">
      <Alert
        message="收货时，将根据货品所属品目，默认入库到相关联的档口；若货品所属品目未关联档口的，则手动选择；"
        type="info"
      />
      <div className={style['bg-base-setcatalog']}>
        <div className={style['bs-micro-setcatalog-title']}>
          {pageParams[nameField]}
        </div>
        <BsSearch {...searchConfig} />
        <BsTable
          autoload={false}
          {...pageInfo}
          dataSource={state.dataSouce}
          treeDataIndex={'catalogName'}
          request={undefined}
          rowKey="catalogId"
          pagination={false}
          loading={loading}
          scroll={undefined}
          expandable={{
            // expandIconColumnIndex: 1,
            expandRowByClick: true,
            expandedRowKeys: state.expandedRowKeys,
            onExpand: (expanded: any, record: any) => {
              const { catalogId, level } = record;
              if (expanded) {
                if (
                  !record.isLeaf &&
                  record.children &&
                  record.children.length === 0
                ) {
                  loadChildren(record, false, level);
                } else {
                  const newexpandedRowKeys: any[] = [
                    ...state.expandedRowKeys,
                    catalogId,
                  ];
                  setState({ expandedRowKeys: newexpandedRowKeys });
                }
              } else {
                const newexpandedRowKeys = state.expandedRowKeys.filter(
                  (key) => key !== catalogId
                );
                //const :any[]=[...state.expandedRowKeys,catalogId];
                setState({ expandedRowKeys: newexpandedRowKeys });
              }
            },
          }}
        />
      </div>
    </PageContainer>
  );
};
const SetCatalogRefTable: React.FunctionComponent<SetCatalogRefProps> =
  ListPage(SetCatalogRef, pagaConfig);
export default SetCatalogRefTable;
