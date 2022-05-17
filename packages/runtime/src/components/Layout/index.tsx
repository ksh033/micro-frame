import React, { useState, useLayoutEffect, useMemo } from 'react';
import { ProSettings, MasterLayout } from '@scboson/sc-layout';
// @ts-ignore
import { Link, history, useModel } from 'umi';
import {
  getUser,
  changeApp,
  initWarnTimer,
  clearTimer,
  initInner,
  getUserAppCode,
} from '../Auth';
import './index.less';
import RightContent from './GlobalHeader/RightContent';
import logo from '../../assets/logo.svg';
import { useExternal, useMount } from 'ahooks';
import useWeightUnit from '../Dict/weightUnit';
import menuFormat from './menuFormat';
import userDictModel from '../Dict/userDictModel';
import { CModal } from '@scboson/sc-element';
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

  const { loadDict } = userDictModel();
  const { loadWeight } = useWeightUnit();
  const systemList = appData || user?.chooseDeptVO?.currentDept.menus || [];
  const whetherNotice = localStorage.getItem(WhetherNoticeKey);

  const { setQiankunGlobalState } =
    useModel('@@qiankunStateForSlave') ||
    useModel('@@qiankunStateFromMaster') ||
    {};

  const appSelectedKeys = getUserAppCode();
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
