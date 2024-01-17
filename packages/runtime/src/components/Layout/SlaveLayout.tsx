import React, { useMemo, useRef, useState } from "react";
//@ts-ignore
import { Link, useLocation, useAppData, matchRoutes, useModel } from "@@/plugin-microlayout/umi";

import { getAppCode, getUserAppCode } from "../Auth";
import BsTable from "../Base/BsTable";
import "./index.less";

import { RouteContext, ErrorBoundary, MenuDataItem, getMenuData } from "@scboson/sc-layout";
// @ts-ignore
import { useMount } from "ahooks";

import { filterRoutes, mapRoutes, useAccessMarkedRoutes } from "./utils";
import menuFormat from "./menuFormat";
import Exception from "./Exception";
import { ProConfigProvider } from "@ant-design/pro-provider";
const { Operation } = BsTable;
const SlaveLayout = (componentProps: any) => {
  const location = useLocation()

  //是否开启权限
  const { children, useAccess = false } = componentProps

  const { globalState } =
    useModel("@@qiankunStateForSlave") ||
    useModel("@@qiankunStateFromMaster") ||
    {};
  const { routeContext } = globalState



  console.log("appData", useAppData())
  const { clientRoutes, basename } = useAppData();
  // //console.log("globalState",globalState)
  //   //主项目路由上下文
  //  const { routeContext } = globalState
  const currentSysRef = useRef<any>(getUserAppCode() || getAppCode());



  const defaultItemRender: any = ({ breadcrumbName, path }) => {
    let url = path ? path.replace(window.routerBase, "") : path;
    if ("/" + path == window.routerBase) {
      url = "/"
    }
    //  @ts-ignore
    return url ? <Link to={url}>{breadcrumbName}</Link> : breadcrumbName;
  };
  //   // 现在的 layout 及 wrapper 实现是通过父路由的形式实现的, 会导致路由数据多了冗余层级, proLayout 消费时, 无法正确展示菜单, 这里对冗余数据进行过滤操作
  const newRoutes = filterRoutes(clientRoutes.filter(route => route.id === 'layout' || route.id == '@@/global-layout'), (route) => {
    return (!!route.isLayout && (route.id !== 'layout' && route.id !== "@@/global-layout")) || !!route.isWrapper;
  })


  const [route] = mapRoutes(useAccess ? useAccessMarkedRoutes(newRoutes, routeContext.menuData, currentSysRef.current, basename) : newRoutes);


  const matchedRoute = useMemo(() => matchRoutes(route.children, location.pathname)?.pop?.()?.route, [location.pathname]);

  const lastMenu =
    Array.isArray(routeContext.breadcrumb.items) && routeContext.breadcrumb.items.length > 0
      ? routeContext.breadcrumb.items[routeContext.breadcrumb.items.length - 1]
      : null;

  const title = lastMenu != null ? lastMenu?.breadcrumbName : undefined;


  return (

    <RouteContext.Provider
      value={{
        title,
        setHasPageContainer: routeContext.setHasPageContainer,
        hasPageContainer: routeContext.hasPageContainer,
        setHasFooterToolbar: routeContext.setHasFooterToolbar,
        hasFooter: routeContext.hasFooter,
        breadcrumb: { items: routeContext.breadcrumb.items, itemRender: defaultItemRender },
        //menuData: routeContext.menuData,
        hasFooterToolbar: true,
      }}
    >
      <ProConfigProvider token={{

        layout: {
          pageContainer: {
            paddingInlinePageContainerContent: 24
          }
        }
      }}>
        <ErrorBoundary>

          <Exception
            route={matchedRoute}

          >

            {children}



          </Exception>

        </ErrorBoundary>

      </ProConfigProvider>
    </RouteContext.Provider >

  );
}


export default SlaveLayout

