/* eslint-disable import/no-unresolved */
import { MenuDataItem } from '@scboson/sc-layout'
import React from 'react'
import { AppstoreFilled } from '@ant-design/icons'

export const getRouterData = (routerConfig: any[]) => {
  let routerData = {}
  routerConfig.forEach((item) => {
    const { exact, path } = item
    const router = {
      exact,
      path,
    }
    if (item.routes) {
      routerData = { ...routerData, ...getRouterData(item.routes) }
    }
    routerData[path] = router
  })
  return routerData
}
function getMenuMap(menu: any[], routes: any): any[] {
  const routersMap = new Map<string, any>()
  const menuMap = new Map<string, any>()

  // const _routerMap = getRouterData(routes);

  const getAllRoute = (_menu: any) => {
    _menu.forEach((item: any) => {
      if (item['key']) {
        const mapkey = `${item['key']}`
        menuMap.set(mapkey.toLowerCase(), item)
      }

      if (item['path']) {
        const mapkey = item['path']
        // const dy = `${mapkey}/:editpage`;
        // if (_routerMap[dy]) {
        //   const { key, path } = item;
        //   if (!item.children) {
        //     item.children = [];
        //   }
        //   actions.forEach((actionItem: any) => {
        //     item.children.push({
        //       title: actionItem.name,
        //       key: `${key}_${actionItem.action}`,
        //       pkey: key,
        //       hidden: true,
        //       path: `${path}/${actionItem.action}`,
        //     });
        //   });
        // }
        routersMap.set(mapkey.toLowerCase(), item)
      }
      if (item.children && item.children.length > 0) {
        getAllRoute(item.children)
      }
    })
  }
  getAllRoute(menu)
  return [routersMap, menuMap]
}

function getBreadcrumb(code: any, menuMap: Map<string, any>) {
  let routes: any = []
  const menuItem = menuMap.get(`${code}`)
  if (menuItem) {
    if (`${menuItem.pkey}` !== '0') {
      routes = [...getBreadcrumb(`${menuItem.pkey}`, menuMap), menuItem]
    } else {
      routes = [menuItem]
    }
  }
  return routes
}
const menuMap = {}
const formatMenu = (
  menus: any[],
  parnetKeys: string[],
  appCode: string,
  localData
) => {
  // const {routersMap, menuMap }=getMenuMap(menus,[]);

  return menus.map<any>((item: any) => {
    const {
      iconUrl,
      id,
      parentId,
      pageUrl,
      //  permCode,
      systemCode,
      functionName,
      //functionType,
      dataType,
      children,
    } = item

    const funcodes: any[] = []
    let newChildren: MenuDataItem[] = []
    if (children && children.length > 0) {
      const pKeys = [...parnetKeys, id]
      newChildren = formatMenu(children, pKeys, appCode, localData)

      children.forEach((citem: any) => {
        if (citem.functionType) {
          funcodes.push(citem.functionType)
        }
      })
    }
    if (parnetKeys.length > 0 && pageUrl) {
      const paths = pageUrl.split('/')
      parnetKeys.forEach((key, i) => {
        if (!menuMap[key]) {
          if (localData === false) {
            menuMap[key] = paths[i + 2]
          } else {
            menuMap[key] = paths[i + 1]
          }
        }
      })
    }
    let hiddenChild = true
    newChildren.forEach((nitem: any) => {
      if (!nitem.hidden) {
        hiddenChild = false
      }
    })

    // const defaultPath = defPaths[menuCode];
    let rpath: string = ''
    //if (appCode && appCode !== '') {
    //rpath = '/' + appCode + pageUrl || menuMap[id]
    // } else {
    rpath = pageUrl || menuMap[id]
    // }
    if (localData === false && rpath) {
      rpath = rpath.replace('/' + appCode, '')
    }

    // newChildren=newChildren.filter((i)=>(i))
    return {
      name: functionName,
      // defaultPath,
      key: `${id}`,
      pkey: parentId,
      path: rpath,
      funcodes: funcodes.join('|'),
      icon: iconUrl || <AppstoreFilled />,
      parentKeys: parnetKeys,
      pageUrl,
      // id,
      syscode: systemCode,
      children: newChildren,
      routes: newChildren,
      hideChildrenInMenu: hiddenChild,
      hideInMenu: dataType === 'FUNC',
    }
  })
}
export default {
  getMenuMap,
  getBreadcrumb,
  formatMenu,
}
