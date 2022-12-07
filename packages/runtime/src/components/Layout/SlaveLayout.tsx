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

  if (!ref.current.mdata) {
    const userAppInfo = getUser()?.userAppInfo;

    if (userAppInfo) {
      const menus = userAppInfo?.currentDept?.menus || [];
      const syscode = userAppInfo?.currentSystem?.systemCode || '';
      const sysMenu = menus.find((it) => it.pageUrl === syscode);
      if (sysMenu) {
        ref.current.mdata = sysMenu.children || [];

        ref.current.syscode = syscode;
      }
    }
  }

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

  const lastMenu =
    Array.isArray(breadcrumbProps.routes) && breadcrumbProps.routes.length > 0
      ? breadcrumbProps.routes[breadcrumbProps.routes.length - 1]
      : null;

  const title = lastMenu != null ? lastMenu?.breadcrumbName : undefined;
  return (
    <SchemaContext.Provider
      value={{
        umi: { history },
        tableOpColCmp: Operation,
      }}
    >
      <RouteContext.Provider
        value={{
          title,
          breadcrumb: breadcrumbProps,
          menuData,
          hasFooterToolbar: true,
        }}
      >
        {children}
      </RouteContext.Provider>
    </SchemaContext.Provider>
  );
}
