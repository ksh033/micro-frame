//@ts-ignore
import type { IRoute } from '@@/plugin-microlayout/umi';
import menuFormat from './menuFormat';
import { useMemo } from 'react';

// 过滤出需要显示的路由, 这里的filterFn 指 不希望显示的层级
export const filterRoutes = (routes: IRoute[], filterFn: (route: IRoute) => boolean) => {
  if (routes.length === 0) {
    return []
  }

  let newRoutes: any = []
  for (const route of routes) {
    const newRoute = { ...route };
    if (filterFn(route)) {
      if (Array.isArray(newRoute.routes)) {
        newRoutes.push(...filterRoutes(newRoute.routes, filterFn))
      }
    } else {
      if (Array.isArray(newRoute.children)) {
        newRoute.children = filterRoutes(newRoute.children, filterFn);
        newRoute.routes = newRoute.children;
      }
      newRoutes.push(newRoute);
    }
  }

  return newRoutes;
}

// 格式化路由 处理因 wrapper 导致的 菜单 path 不一致
export const mapRoutes = (routes: IRoute[]) => {
  if (routes.length === 0) {
    return []
  }
  return routes.map(route => {
    // 需要 copy 一份, 否则会污染原始数据
    const newRoute = { ...route }
    if (route.originPath) {
      newRoute.path = route.originPath
    }

    if (Array.isArray(route.routes)) {
      newRoute.routes = mapRoutes(route.routes);
    }

    if (Array.isArray(route.children)) {
      newRoute.children = mapRoutes(route.children);
    }

    return newRoute
  })
}

export const useAccessMarkedRoutes = (routes: IRoute[], menuData, syscode, basename): any => {

  const menuMap = useMemo(() => {
    return menuFormat.getMenuMap(menuData, routes, basename)

  }, [menuData])
  const [routersMap] = menuMap
  //console.log("acc2",routersMap)
  const markdedRoutes: IRoute[] = useMemo(() => {



    const process = (route: IRoute) => {
      // let accessCode = route.access;
      // // 用父级的路由检测父级的 accessCode
      // let detectorRoute = route;
      // if (!accessCode && parentAccessCode) {
      //   accessCode = parentAccessCode;
      //   detectorRoute = parentRoute;
      // }


      // set default status
      route.unaccessible = false;
      const syscMap = routersMap[syscode]
      if (route.path !== "*" && route.path != "/") {

        const key = `${basename}/${route.path.toLowerCase()}`
        //console.log("acc",key,routersMap[syscode][key])
        if (!routersMap[syscode][key]) {
          if (route.path.indexOf("/salesreport/goods") > -1) {

          }
          route.unaccessible = true;
        }

      }
      //  routersMap[route.path]
      // const key=`${window.routerBase}/${route.path}`
      // console.log(routersMap[syscode][key],key)

      // check access code
      // if (typeof accessCode === 'string') {
      //   const detector = access[accessCode];

      //   if (typeof detector === 'function') {
      //     route.unaccessible = !detector(detectorRoute);
      //   } else if (typeof detector === 'boolean') {
      //     route.unaccessible = !detector;
      //   } else if (typeof detector === 'undefined') {
      //     route.unaccessible = true;
      //   }
      // }

      // check children access code
      if (route.children?.length) {
        const isNoAccessibleChild = !route.children.reduce((hasAccessibleChild, child) => {
          process(child);

          return hasAccessibleChild || !child.unaccessible;
        }, false);

        // // make sure parent route is unaccessible if all children are unaccessible
        // if (isNoAccessibleChild) {
        //   route.unaccessible = true;
        // }
      }

      // check children access code
      if (route.routes?.length) {
        const isNoAccessibleChild = !route.routes.reduce((hasAccessibleChild, child) => {
          process(child);

          return hasAccessibleChild || !child.unaccessible;
        }, false);

        // // make sure parent route is unaccessible if all children are unaccessible
        // if (isNoAccessibleChild) {
        //   route.unaccessible = true;
        // }
      }

      return route;
    }


    return routes.map(route => process(route));
  }, [routes.length]);
  return markdedRoutes;
}
