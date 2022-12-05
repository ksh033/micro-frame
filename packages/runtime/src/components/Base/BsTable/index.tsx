import { ScTable } from '@scboson/sc-element';
import type { ScTableProps } from '@scboson/sc-element/es/sc-table';
import { ListToolBarProps } from '@scboson/sc-element/es/sc-table/components/ListToolBar';
import { Badge } from 'antd';
import { isArray, isObject } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import Authority from '../../Auth/Authority';
import defaultRenderText, { cacheRender } from '../../Dict/defaultRender';
import userDictModel from '../../Dict/userDictModel';
import ToolBar from '../ToolBar';
import { execlColumnsFormat } from './execlUtil';
import styles from './index.less';
import Operation from './Operation';
// @ts-ignore
import { setLocalSearchParams } from '@scboson/sc-schema/es/hooks/useListPage';
// @ts-ignore
import { history } from 'umi';

export type ExcelColumn = {
  text: string;
  field: string;
  dataType: 'STRING' | 'CURRENCY' | 'NUMBER';
  pattern: string;
  expression: string;
  children: ExcelColumn[];
};

export type ExportExeclConfig = {
  excelColumn?: ExcelColumn[];
  fileName: string;
  queryParams?: any;
  btnText?: string;
};

export interface BsTableProps
  extends Omit<ScTableProps<any>, 'toolbar' | 'request'> {
  toolbar?: any;
  request?: (params: any, options?: any) => Promise<any>;
  exportExeclConfig?: false | ExportExeclConfig;
  groupLabels?:
  | false
  | {
    queryDataIndex?: string;
    dictType?: string;
    needAll?: boolean;
  };
}
export interface BsTableComponentProps {
  dataIndex?: string;
  rowData?: any;
  value?: any;
}

const renderBadge = (count: number, active = false) => {
  return (
    <Badge
      count={count}
      style={{
        marginTop: -2,
        marginLeft: 4,
        color: active ? '#1890FF' : '#999',
        backgroundColor: active ? '#E6F7FF' : '#eee',
      }}
    />
  );
};

const BsTable: React.FC<BsTableProps> = (props: BsTableProps) => {
  const {
    toolbar = [],
    columns = [],
    data,
    toolBarRender,
    onLoad,
    scroll = { x: 'max-content' },
    options,
    exportExeclConfig = false,
    groupLabels: groupLabelsProps = false,
    params = {},
    saveRef,
    pagination,
    ...restProps
  } = props;

  const { getDistList, getDictText } = userDictModel();
  let defaultActiveKey = '';
  // 默认的tab切换配置
  const defaultLabelsProps = {
    needAll: true,
  };
  const groupLabels =
    groupLabelsProps !== false
      ? Object.assign({}, defaultLabelsProps, groupLabelsProps)
      : false;

  if (groupLabels !== false) {
    defaultActiveKey = groupLabels && groupLabels.needAll ? 'all' : '';
    if (params[groupLabels.queryDataIndex || '']) {
      defaultActiveKey = params[groupLabels.queryDataIndex || ''];
    }
  }
  const oldActiveKey = useRef<React.Key>(defaultActiveKey);
  const [activeKey, setActiveKey] = useState<React.Key>(defaultActiveKey);
  const [groupLabelsMap, setGroupLabelsMap] = useState<any>({});

  const actionRef = useRef<any>();

  const request = restProps.request;

  const onExportExecl = () => {
    if (exportExeclConfig !== false) {
      const execlParams = {
        columns: execlColumnsFormat(
          columns,
          actionRef.current.columnsMap,
          exportExeclConfig
        ),
        queryParams: {
          ...params,
          size: 10,
          current: 1,
          ...(exportExeclConfig.queryParams || {}),
        },
        fileName: exportExeclConfig.fileName || Date.now() + '',
      };
      request?.(execlParams, {
        headers: {
          excelMeta: 1,
        },
      });
    }
  };

  if (exportExeclConfig !== false) {
    toolbar.unshift({
      text: exportExeclConfig.btnText || '导出execl',
      funcode: 'EXPORT',
      onClick: onExportExecl,
      type: 'primary',
    });
  }

  const columnsFormat = (list: any[]) => {
    list.forEach((col: any, index: number) => {
      if (Array.isArray(col.children) && col.children.length > 0) {
        col.children = columnsFormat(col.children);
      }

      const list: any = getDistList({
        dictTypeCode: `${col.dataType || col.dataIndex}`,
      });
      if (!col.width) {
        col.width = 180;
      }

      if (list && !col.render) {
        col.render = (text: string) => {
          return cacheRender(text, list);
        };
      } else if (col.dataType && !col.render) {
        col.render = (text: string, record: any) => {
          return defaultRenderText(text, col.dataType || col.dataIndex, record);
        };
      } else if (col.component && !col.render) {
        const comProps = col.props || {};
        col.render = (text: any, record: any) => {
          if (
            col.component.displayName &&
            col.component.displayName === 'Enabled'
          ) {
            if (!comProps['funcode']) comProps['funcode'] = 'ENABLE';
          }
          const component =
            typeof col.component === 'function'
              ? React.createElement(col.component, {
                rowData: record,
                dataIndex: col.dataIndex,
                value: text,
                ...comProps,
              })
              : React.cloneElement(col.component, {
                rowData: record,
                dataIndex: col.dataIndex,
                value: text,
                ...comProps,
              });
          return component;
        };
      } else if (list && col.render) {
        const render = col.render;
        col.render = (text, record, index) => {
          const dictText = cacheRender(text, list);
          return render(dictText, record, index);
        };
      }
    });

    return list;
  };

  const newColumns = columnsFormat(columns).map((it, index) => {
    if (index < 2 && it.fixed == null) {
      it.fixed = true;
    }
    if (it.dataType === 'money' || it.dataType === 'unitprice') {
      it.align = 'right';
    }
    return {
      key: it.dataIndex || index,
      ...it,
    };
  });

  let newToolBarRender: any;

  let rtoolBarRender: any = () => {
    const hasToolBar = Array.isArray(toolbar) && toolbar.length > 0;
    const toolBarRender = hasToolBar ? (
      <ToolBar
        buttons={toolbar}
        className={styles['bs-table-toolbar-btn']}
      ></ToolBar>
    ) : (
      []
    );
    return toolBarRender;
  };
  if (toolBarRender === false) {
    newToolBarRender = false;
  } else {
    if (toolBarRender) {
      newToolBarRender = toolBarRender;
    } else {
      newToolBarRender = rtoolBarRender;
    }
  }
  const dataLoad = (data: any) => {
    let newData = {};
    if (data) {
      if (onLoad) {
        newData = onLoad(data);
      }
      if (!isArray(data)) {
        let rows = data.records || data.rows || [];
        const { current = 1, size = 10 } = data;
        rows = rows.map((item: any, index: number) => {
          const titem = item;
          titem.index = index + 1 + (current - 1) * size;
          return titem;
        });
        newData = {
          rows,
          total: data.total,
          current,
          size,
        };
      } else {
        newData = data;
      }
    } else {
      newData = {
        total: 0,
        rows: [],
      };
    }
    if (groupLabels !== false && isObject(data.groupLabels)) {
      setGroupLabelsMap(data.groupLabels);
      if (groupLabels.needAll !== true) {
        const key = Object.keys(data.groupLabels)[0];
        setActiveKey(key);
      }
    }
    return newData;
  };
  // 初始化tab栏
  const getToolbarProps = (
    _activeKey: React.Key,
    map: any
  ): ListToolBarProps | undefined => {
    if (groupLabels !== false) {
      const list: any[] = [];
      if (groupLabels.needAll) {
        list.push({
          key: 'all',
          label: '全部',
        });
      }
      Object.keys(map).forEach((key) => {
        const text = getDictText(
          {
            dictTypeCode:
              groupLabels.dictType || groupLabels.queryDataIndex || '',
          },
          key
        );
        list.push({
          key: key,
          label: (
            <span>
              {text}
              {renderBadge(map[key] || 0, _activeKey === key)}
            </span>
          ),
        });
      });
      return {
        menu: {
          type: 'tab',
          activeKey: _activeKey,
          items: list,
          onChange: (key) => {
            if (history && history.location) {
              const { pathname, search } = history.location;
              const pathKey = pathname + search;
              if (pathKey) {
                setLocalSearchParams(pathKey, {
                  current: 1,
                  [groupLabels.queryDataIndex || '']: key,
                });
              }
            }
            setActiveKey(key as string);
          },
        },
      };
    }
    return void 0;
  };

  const newParams = useMemo(() => {
    if (groupLabels !== false) {
      const rparams = params || {};
      rparams.needGroupLabel = true;
      rparams[groupLabels.queryDataIndex || ''] =
        activeKey !== 'all' ? activeKey : null;
      return rparams;
    } else {
      return params;
    }
  }, [params, activeKey, groupLabels]);

  const newPagination = useMemo(() => {
    if (
      pagination !== false &&
      groupLabels !== false &&
      Object.prototype.toString.call(pagination) === '[object Object]'
    ) {
      if (oldActiveKey.current !== activeKey) {
        oldActiveKey.current = activeKey;
        return {
          ...pagination,
          current: 1,
        };
      } else {
        return pagination;
      }
    }
    return pagination;
  }, [activeKey, pagination]);

  return (
    <>
      <div className={'bs-table-list'}>
        <ScTable
          scroll={scroll}
          size="small"
          onLoad={dataLoad}
          data={data}
          columns={newColumns}
          toolBarRender={newToolBarRender}
          toolbar={getToolbarProps(activeKey, groupLabelsMap)}
          options={options}
          // options={
          //   options || {
          //     reload: true,
          //     setting: true,
          //   }
          // }
          saveRef={(action: any) => {
            if (saveRef) {
              // @ts-ignore
              saveRef.current = action;
            }
            actionRef.current = action;
          }}
          params={newParams}
          pagination={newPagination}
          {...restProps}
        />
      </div>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
type BsTable = typeof BsTable;
interface Table extends BsTable {
  Operation: any;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Table: Table = BsTable as Table;
Table.Operation = Authority(Operation);

export default Table;
