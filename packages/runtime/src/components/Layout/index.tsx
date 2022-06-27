import { MasterLayout, ProSettings } from '@scboson/sc-layout';
import { useLayoutEffect, useMemo, useState } from 'react';
// @ts-ignore
import { CModal } from '@scboson/sc-element';
import { useExternal, useMount } from 'ahooks';
// @ts-ignore
import { history, Link, useModel } from 'umi';
import logo from '../../assets/logo.svg';
import {
  changeApp,
  clearTimer,
  getAppCode,
  getUser,
  getUserAppCode,
  initInner,
  initWarnTimer,
} from '../Auth';
import userDictModel from '../Dict/userDictModel';
import userLocationarea from '../Dict/userLocationarea';
import useWeightUnit from '../Dict/weightUnit';
import RightContent from './GlobalHeader/RightContent';
import './index.less';
import menuFormat from './menuFormat';
// 是否通知key
const WhetherNoticeKey = 'WHETHER-NOTICE-KEY';

export default (props: any) => {
  useExternal('https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js', {
    async: false,
  });
  const [settings] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
  });
  //isMaster 是否是主应用
  const { children, userConfig, isMaster, ...restProps } = props;
  const { menuData, appData, appSelected, localMenuData } = userConfig || {};
  const user = getUser();
  const userAppInfo = user?.chooseDeptVO;
  const userLocation = user?.userAppInfo.currentDept?.userLocation || false;

  const { loadDict } = userDictModel();
  const { loadWeight } = useWeightUnit();
  const { loadLocationarae } = userLocationarea();
  const systemList = appData || user?.chooseDeptVO?.currentDept.menus || [];
  const whetherNotice = localStorage.getItem(WhetherNoticeKey);

  const { setQiankunGlobalState } =
    useModel('@@qiankunStateForSlave') ||
    useModel('@@qiankunStateFromMaster') ||
    {};

  const appSelectedKeys = getUserAppCode() || getAppCode();
  const apps = systemList.map((sys) => ({
    name: sys.name || sys.systemName,
    code: sys.pageUrl || sys.systemCode,
    disabled: user?.needModifyPwd,
    isApp: true,
    path: sys.pageUrl ? `/${sys.pageUrl}` : `/${sys.systemCode}`,
  }));
  // const mdata = menuData ? menuData : userAppInfo?.currentSystem?.menus || [];

  const mdata = useMemo(() => {
    let newMenuData = menuData;
    if (newMenuData == null) {
      const menuList = Array.isArray(userAppInfo?.currentDept.menus)
        ? userAppInfo?.currentDept.menus
        : [];
      if (menuList) {
        const currentSystem = menuList.find(
          (it) => it.pageUrl === appSelectedKeys
        );
        if (currentSystem && Array.isArray(currentSystem.children)) {
          newMenuData = currentSystem.children;
        }
      }
    }
    return newMenuData;
  }, [menuData, appSelectedKeys]);

  useLayoutEffect(() => {
    // 初始化内置值
    initInner();
    // 加载枚举
    loadDict();
    // 加载计重单位
    loadWeight();

    if (userLocation) {
      // 加载库区或者档口
      loadLocationarae();
    }

    if (!isMaster) {
      console.log(appSelected);
      if (appSelected) {
        if (!changeApp(appSelected)) {
          history.push('/');
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
      localStorage.setItem(WhetherNoticeKey, 'true');
      // @ts-ignore
      CModal.confirm({
        title: '绑定您的个人微信号，下次可使用微信扫码登录，更加快速安全',
        okText: '立即绑定',
        cancelText: '暂不绑定',
        onOk: () => {
          history.push({
            pathname: '/system/current',
            query: {
              currentKey: 'binding',
              autoOpen: true,
            },
          });
        },
      });
    }
  });

  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
      <MasterLayout
        logo={logo}
        apps={apps}
        onPageChange={(location, menuItem) => {
          if (menuItem && menuItem.key)
            setQiankunGlobalState &&
              setQiankunGlobalState({ currentMenu: menuItem });
        }}
        appMenuProps={{
          onSelect: async (keys: any) => {
            if (keys && keys.length > 0) {
              if (!changeApp(keys[0])) {
                changeApp(keys[0]);
              }
              history.push('/' + keys[0]);
            }
          },
        }}
        itemRender={({ breadcrumbName, path }: any) => {
          const { routerBase = '/' } = window;
          const url = path.replace(routerBase, '');

          return (
            <Link href={path} to={url}>
              {breadcrumbName}
            </Link>
          );
        }}
        appSelectedKeys={[appSelectedKeys]}
        {...restProps}
        menuDataRender={() => {
          const menus = menuFormat.formatMenu(
            mdata || [],
            [],
            appSelectedKeys,
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
            <Link
              onClick={() => {
                sessionStorage.removeItem('SEARCH_PARAMS');
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
    </div>
  );
};
