import { LayoutContextType, MasterLayout, ProSettings, RouteContext, RouteContextType } from "@scboson/sc-layout";
import { useContext, useEffect, useLayoutEffect, useMemo, useState, useRef } from "react";
// @ts-ignore
import { CModal } from "@scboson/sc-element";
import { useExternal, useMount } from "ahooks";
// @ts-ignore
import { history, Link, useModel, useLocation, useAppData, Outlet } from "umi";

import { filterRoutes, mapRoutes, useAccessMarkedRoutes } from './utils'
import BsIcon from '../Base/BsIcon'
import { useUpdate } from 'ahooks'
import logo from "../../assets/logo.svg";
import {
  changeApp,
  clearTimer,
  getAppCode,
  getUser,
  getUserAppCode,
  initInner,
  initWarnTimer,
} from "../Auth";
import userDictModel from "../Dict/userDictModel";
import userLocationarea from "../Dict/userLocationarea";
import useWeightUnit from "../Dict/weightUnit";
import RightContent from "./GlobalHeader/RightContent";
import "./index.less";
import menuFormat from "./menuFormat";
import { ConfigProvider } from "antd";
// 是否通知key
const WhetherNoticeKey = "WHETHER-NOTICE-KEY";


export default (props: any) => {
  useExternal("https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js", {
    async: false,
  });
  const [settings] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
  });
  const update = useUpdate()
  //isMaster 是否是主应用
  const { children, userConfig, isMaster, ...restProps } = props;
  const { menuData, appData, appSelected, localMenuData } = userConfig || {};
  const user = getUser();
  const userAppInfo = user?.chooseDeptVO;
  const useWmsLocation = user?.userAppInfo.currentDept?.useLocation || false;
  const location = useLocation();
  const { clientRoutes, pluginManager } = useAppData();
  // 现在的 layout 及 wrapper 实现是通过父路由的形式实现的, 会导致路由数据多了冗余层级, proLayout 消费时, 无法正确展示菜单, 这里对冗余数据进行过滤操作
  const newRoutes = filterRoutes(clientRoutes.filter(route => route.id === 'layout' || route.id == '@@/global-layout'), (route) => {
    return (!!route.isLayout && (route.id !== 'layout' && route.id !== "@@/global-layout")) || !!route.isWrapper;
  })
  const [route] = mapRoutes(newRoutes);


  const { loadDict } = userDictModel();
  const { loadWeight } = useWeightUnit();
  const { loadLocationarae } = userLocationarea();
  // const systemList = appData || user?.chooseDeptVO?.currentDept.menus || [];
  const whetherNotice = localStorage.getItem(WhetherNoticeKey);

  const { setQiankunGlobalState } =
    useModel("@@qiankunStateForSlave") ||
    useModel("@@qiankunStateFromMaster") ||
    {};
  const currentSysRef = useRef<any>(getUserAppCode() || getAppCode());


  const mdata = useMemo(() => {
    let newMenuData: any[] | undefined = menuData;
    if (newMenuData == null) {


      newMenuData = userAppInfo?.currentDept.menus;

      newMenuData?.forEach((item) => {
        const code = `sc-icon-${item.pageUrl}`
        item.iconUrl = <BsIcon name={code} type={code}></BsIcon>
        // item.key=item.pageUrl
        item.systemCode = item.pageUrl
        item.id = item.pageUrl
        item.isApp = true
      })

    } else {
      //处理本地单应用
      //const [app]=apps;
      const [sys] = appData

      const newApp = {
        //  name: sys.systemName,
        functionName: sys.systemName,
        // code: sys.systemCode || sys.pageUrl,
        id: sys.systemCode || sys.systemCode,
        disabled: user?.needModifyPwd,
        iconUrl: <BsIcon name={sys.systemCode} type={sys.systemCode}></BsIcon>,
        isApp: true,
        systemCode: sys.systemCode,
        pageUrl: sys.pageUrl ? `/${sys.pageUrl}` : `/${sys.systemCode}`,
        path: sys.pageUrl ? `/${sys.pageUrl}` : `/${sys.systemCode}`,
      }

      newMenuData = [{ ...newApp, children: newMenuData }];
    }
    return newMenuData;
  }, [menuData]);

  useLayoutEffect(() => {
    // 初始化内置值
    initInner();
    // 加载枚举
    loadDict();
    // 加载计重单位
    loadWeight();

    if (useWmsLocation) {
      // 加载库区或者档口
      loadLocationarae();
    }

    if (!isMaster) {
      console.log(appSelected);
      if (appSelected) {
        if (!changeApp(appSelected)) {
          history.push("/");
        }
      }
    }
    // 初始化定时器
    initWarnTimer();
    return () => {
      clearTimer();
    };
  }, []);

  useMount(() => {
    if (
      (whetherNotice === undefined || whetherNotice === null) &&
      user?.wechatUnionId === null
    ) {
      localStorage.setItem(WhetherNoticeKey, "true");
      // @ts-ignore
      CModal.confirm({
        title: "绑定您的个人微信号，下次可使用微信扫码登录，更加快速安全",
        okText: "立即绑定",
        cancelText: "暂不绑定",
        onOk: () => {
          history.push({
            pathname: "/system/current",
            query: {
              currentKey: "binding",
              autoOpen: true,
            },
          });
        },
      });
    }

    // if (!setQiankunGlobalState.routeContextRef){
    //   setQiankunGlobalState({ routeContext: routeContextRef.current})
    // }
    // console.log("routeContextRef", routeContextRef)
  });

  const routeContextRef = useRef<RouteContextType & LayoutContextType>()




  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
      }}
    >
      <ConfigProvider
        getTargetContainer={() => {
          return document.getElementById('test-pro-layout') || document.body;
        }}
      >
      <MasterLayout
        ref={routeContextRef}
        logo={logo}
        route={route}
        location={location}
        // apps={apps}
        onPageChange={(location, menuItem) => {
          if (menuItem && menuItem.key)
            setQiankunGlobalState &&
              setQiankunGlobalState({ currentMenu: menuItem, routeContext: routeContextRef.current });
        }}
        appMenuProps={{
          // onSelect: async ({ selectedKeys }) => {


          //   const keys = selectedKeys
          //   if (keys && keys.length > 0) {
          //     if (!changeApp(keys[0])) {
          //       changeApp(keys[0]);
          //     }
          //    const item= mdata?.find(({id})=>{
          //       return id=keys[0]
          //     })
          //     if (item){
          //       update()
          //      // history.push("/" + item.pageUrl);
          //     }

          //   }
          // },
        }}
        itemRender={({ breadcrumbName, path }: any) => {
          const { routerBase = "/" } = window;
          const url = path.replace(routerBase, "");

          return url ? (
            //  @ts-ignore
            <Link href={path} to={url}>
              {breadcrumbName}
            </Link>
          ) : (
            breadcrumbName
          );
        }}
        appSelectedKeys={[currentSysRef.current]}
        {...restProps}
        menuDataRender={() => {
          const menus = menuFormat.formatMenu(
            mdata || [],
            [],
            "",
            localMenuData
          );
          return menus;
        }}
        menuFooterRender={(_props: any) => {}}
        menuItemRender={(item: any, dom) => {


          const { path } = item;


          if (item.isApp) {
            return <a>{dom}</a>;
          }
          return (
            // @ts-ignore
            <Link
              onClick={() => {
                console.log(item)
                if (item.syscode !== currentSysRef.current) {
                  currentSysRef.current = item.syscode
                  changeApp(currentSysRef.current);

                }
                sessionStorage.removeItem("SEARCH_PARAMS");
              }}
              to={{
                pathname: `${path}`,
              }}
            >
              {dom}
            </Link>
          );
        }}
        rightContentRender={() => (
          <RightContent currentUser={user} menu></RightContent>
        )}
        {...settings}
        navTheme="light"
      >


        {children}
      </MasterLayout>
      </ConfigProvider>
    </div>
  );
};


