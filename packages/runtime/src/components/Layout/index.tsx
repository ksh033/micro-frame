import React, { useState, useEffect } from 'react'
import { ProSettings, MasterLayout } from '@scboson/sc-layout'
// @ts-ignore
import { Link, history, useModel } from 'umi'
import {
  getUser,
  changeApp,
  restUserAppCode,
  getUserAppCode,
  checkUserDept,
} from '../Auth'
import { uesRequest } from '../../utils/api'
import RightContent from './GlobalHeader/RightContent'
import logo from '../../assets/logo.svg'
import { useMount } from 'ahooks'
import useWeightUnit from '../Dict/weightUnit'
import menuFormat from './menuFormat'
import userDictModel from '../Dict/userDictModel'

import './index.less'

export default (props: any) => {
  const [settings] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
  })
  //isMaster 是否是主应用
  const { children, userConfig, isMaster, ...restProps } = props
  const { menuData, appData, appSelected, localMenuData } = userConfig || {}
  const user = getUser()
  const userAppInfo = user?.userAppInfo
  const req = uesRequest('user', 'chooseSys')
  const { loadDict, dict } = userDictModel()
  const { loadWeight } = useWeightUnit()
  const systemList = appData || user?.systemList
  //独立运行是模拟setQiankunGlobalState
  const { setQiankunGlobalState } =
    useModel('@@qiankunStateForSlave') ||
    useModel('@@qiankunStateFromMaster') ||
    {}

  const appSelectedKeys = appSelected || getUserAppCode() || []
  const apps = systemList.map((sys) => ({
    name: sys.systemName,
    code: sys.systemCode,
    disabled: user?.needModifyPwd,
    isApp: true,
    path: `/${sys.systemCode}`,
  }))
  const mdata = menuData ? menuData : userAppInfo?.menuTreeNodeList || []
  //const [appCode, setAppCode] = useState<any>();
  // const [pathname, setPathname] = useState('/welcome');
  useEffect(() => {
    // 加载枚举
    loadDict()
    // 加载计重单位
    loadWeight()
    if (!isMaster) {
      if (appSelected) {
        if (!changeApp(appSelected)) {
          req.run({ systemCode: appSelected }).then((data) => {
            changeApp(appSelected, data)
            history.push('/')
          })
        }
      }
    }
  }, [])
  useMount(() => {
    //if (window.addEventListener) {
    //window.addEventListener("unload", page_unload, false);
    // }else{
    window.onunload = function () {
      console.log('重置窗口')
      restUserAppCode(getUserAppCode())
    }
    // }

    // function page_unload() {
    //   //const appCode = globalState.currentApp;

    //   restUserAppCode(getUserAppCode());
    //   return true;
    // }
    // window.location
    if (!checkUserDept(location.pathname)) {
      history.push('/selectDept')
    }
  })

  // const cehckDept = () => {
  //   const currentUser = getUser();
  //   if (location.pathname !== "/selectDept") {
  //     if (currentUser) {
  //       const { userAppInfo } = currentUser;
  //       if (userAppInfo) {
  //         const { currentDept, needChooseDept } = userAppInfo;
  //         if (!currentDept && needChooseDept) {
  //           // setTimeout()

  //           return false;
  //         }
  //       }
  //     }
  //   }
  //   return true;
  // };
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
              setQiankunGlobalState({ currentMenu: menuItem })
        }}
        appMenuProps={{
          onSelect: async (keys: any) => {
            if (keys && keys.length > 0) {
              if (!changeApp(keys[0])) {
                const data = await req.run({ systemCode: keys[0] })
                changeApp(keys[0], data)
              }
              if (!checkUserDept(location.pathname)) {
                history.push('/selectDept')
              } else {
                history.push('/' + keys[0])
              }
            }
          },
        }}
        itemRender={({ breadcrumbName, path }: any) => {
          const { routerBase = '/' } = window
          const url = path.replace(routerBase, '')

          return (
            <Link href={path} to={url}>
              {breadcrumbName}
            </Link>
          )
        }}
        appSelectedKeys={[appSelectedKeys]}
        {...restProps}
        menuDataRender={() => {
          const menus = menuFormat.formatMenu(
            mdata || [],
            [],
            appSelectedKeys,
            localMenuData
          )
          return menus
        }}
        menuFooterRender={(_props: any) => {}}
        menuItemRender={(item: any, dom) => {
          const { path, syscode } = item
          let search = ''
          // const paths = path.substring(1, path.length).split('/')
          // const [currentSysCode]=paths;
          //if (appSelectedKeys && appSelectedKeys.length > 0) {
          // const [currentSysCode] = appSelectedKeys;
          // if (currentSysCode !== syscode) {
          //   search = "refsyscode=" + syscode;
          // }
          //}

          if (item.isApp) {
            return <a>{dom}</a>
          }

          //   to={`${item.path}`}
          return (
            <Link
              to={{
                pathname: `${path}`,
              }}
            >
              {dom}
            </Link>
          )
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
  )
}
