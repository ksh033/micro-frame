import React, { useRef } from 'react';
//@ts-ignore
import { history, Link } from 'umi';
//@ts-ignore
import { SchemaContext } from '@scboson/sc-schema';
import { getUser } from '../Auth';
import BsTable from '../Base/BsTable';
import useMergedState from 'rc-util/es/hooks/useMergedState';

//@ts-ignore
import { RouteContext } from '@scboson/sc-layout';
import {
  getMenuData,
  getBreadcrumbProps,
} from '@scboson/sc-layout/es/MasterLayout';
import menuFormat from './menuFormat';
const { Operation } = BsTable;
export default function SlaveLayout(componentProps: any) {
  const { children, route, menu, ...resProps } = componentProps;
  const ref = useRef<any>({});

  const [menuInfoData, setMenuInfoData] = useMergedState<{
    breadcrumb?: Record<string, any>;
    breadcrumbMap?: Map<string, any>;
    menuData?: any[];
  }>(() =>
    getMenuData(route?.routes || [], menu, undefined, (menuItems: any[]) => {
      const menus = menuFormat.formatMenu(
        ref.current.mdata || [],
        [],
        ref.current.syscode,
        false
      );
      return menus;
    })
  );
  const { breadcrumb = {}, breadcrumbMap, menuData = [] } = menuInfoData;
  const defaultItemRender: any = ({ breadcrumbName, path }) => {
    let url = path ? path.replace(window.routerBase, '') : path;
    const item = breadcrumbMap?.get(url);
    if (!item || (item && !item['pageUrl'])) {
      url = '';
    }
    return url ? <Link to={url}>{breadcrumbName}</Link> : breadcrumbName;
  };
  // gen breadcrumbProps, parameter for pageHeader
  const breadcrumbProps = getBreadcrumbProps({
    ...resProps,
    breadcrumbMap,
    itemRender: defaultItemRender,
  });
  return (
    <SchemaContext.Provider
      value={{
        umi: { history },
        tableOpColCmp: Operation,
      }}
    >
      <RouteContext.Provider
        value={{
          breadcrumb: breadcrumbProps,
          menuData,
        }}
      >
        {children}
      </RouteContext.Provider>
    </SchemaContext.Provider>
  );
}
