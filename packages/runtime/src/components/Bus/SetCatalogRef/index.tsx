import { CModal } from '@scboson/sc-element';
import type { PageConfig } from '@scboson/sc-schema';
import { ListPage, useListPageContext } from '@scboson/sc-schema';
import { useRequest, useSetState } from 'ahooks';
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
  showAddRefBtn?: boolean;
};

const SetCatalogRef: React.FC<SetCatalogRefProps> = (props) => {
  const {
    request,
    nameField = 'stallName',
    valueField = 'stallId',
    occupyRequest,
    saveRequest,
    showAddRefBtn = true,
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

  const reload = () => {
    loadChildren(params);
  };

  const [state, setState] = useSetState<{
    expandedRowKeys: any[];
    dataSouce: any[];
  }>({
    expandedRowKeys: [],
    dataSouce: [],
  });

  const loadChildren = (params: any) => {
    let newParams = {
      ...params,
    };
    newParams[valueField] = pageParams[valueField];

    run(newParams).then((data: any) => {
      if (data && Array.isArray(data.children)) {
        setState({
          dataSouce: data.children,
          expandedRowKeys: [],
        });
      } else {
        setState({
          dataSouce: [],
          expandedRowKeys: [],
        });
      }
    });
  };

  const pageInfoConfig = page.getTable();

  if (showAddRefBtn) {
    pageInfoConfig.addButton({
      text: '修改关联品目',
      type: 'primary',
      funcode: 'EDIT',
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
            params: pageParams,
            reload,
          },
        });
      },
    });
  }

  const pageInfo = pageInfoConfig.toConfig();

  const params = useMemo(() => {
    return { [valueField]: pageParams[valueField], ...pageInfo.params };
  }, [JSON.stringify(pageInfo.params)]);

  useEffect(() => {
    loadChildren(params);
  }, [params]);

  const modalButtons = [
    {
      text: '返回',
      onClick() {
        history.back();
      },
    },
  ];

  return (
    <PageContainer title="关联货品品目" footer={modalButtons}>
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
          treeDataIndex={'catalogId'}
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
                const newexpandedRowKeys: any[] = [
                  ...state.expandedRowKeys,
                  catalogId,
                ];
                setState({ expandedRowKeys: newexpandedRowKeys });
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
