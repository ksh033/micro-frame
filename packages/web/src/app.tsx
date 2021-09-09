import { useState } from 'react'
import { Auth, Login, SelectDept, getServiceApi } from '@micro-frame/sc-runtime'
import { history } from 'umi'

const { getUser } = Auth

window.masterHistory = history

const masterUrl = SC_MASTER_URL || ''
//@ts-ignore
window.masterWindow = window

export const qiankun = getServiceApi('system', 'getApplist')()
  .then((data: any) => {
    const apps: any[] = []
    const routes: any[] = []
    data.forEach((item: { systemCode: any; systemName: any }) => {
      const { systemCode } = item
      // console.log(`${masterUrl}micro-${systemCode}/`)
      apps.push({
        name: systemCode,
        to: `/${systemCode}`,
        entry: `${masterUrl}micro-${systemCode}/`,
        activeRule: `/${systemCode}`,
        // entry: `${masterUrl}${systemCode}/`,
        // activeRule: `/micro-${systemCode}`,

        microAppProps: {
          autoSetLoading: true,
        },
      })
      routes.push({
        path: `/${systemCode}`,
        microApp: systemCode,
      })
    })
    return {
      apps,
      routes,
      prefetch: false,
      // sandbox:{
      //   strictStyleIsolation:false,
      //   fetch:(url: string, ...args: any)=> {
      //     if (url.indexOf("127.0.0.1")>-1) {
      //       return window.fetch(url, {
      //         ...args,
      //         mode: 'cors',
      //         credentials: 'include',
      //       });
      //     }

      //     return window.fetch(url, ...args);
      //   },
      // },
      // fetch:(url: string, ...args: any)=> {
      //   console.log(url)
      //   if (url.indexOf("127.0.0.1")>-1) {
      //     return window.fetch(url, {
      //       ...args,
      //       mode: 'cors',
      //       credentials: 'include',
      //     });
      //   }

      //   return window.fetch(url, ...args);
      // },
      excludeAssetFilter: (assetUrl: string) => {
        if (assetUrl.indexOf('127.0.0.1') > -1) {
          return true
        }
        return false
      },
      lifeCycles: {
        beforeLoad: (app: any) => {
          console.log(app)
          //@ts-ignore
          window.syscode = app.name
        },
        afterMount: (props: any) => {
          // console.log('afterMount');
        },
      },
    }
  })
  .catch(() => {})
export function onRouteChange({ location }: any) {
  // if (matchedRoutes.length) {
  // document.title = matchedRoutes[matchedRoutes.length - 1].route.title || '';
  // }
  if (location.pathname !== '/selectDept') {
    const currentUser = getUser()
    if (currentUser) {
      const { currentDept, needChooseDept } = currentUser.userAppInfo
      if (!currentDept && needChooseDept) {
        history.push('/selectDept')
      }
    }
  }
}

export function render(oldRender: any) {
  const currentUser = getUser()
  if (currentUser) {
    // if (currentUser && currentUser.userAppInfo.currentDept) {
    // currentUser.currentSystem.
    // history.push(`/${currentUser.userAppInfo.currentSystem.systemCode}`);
    // }
    // console.log(getRoutes().)
    oldRender()
  } else {
    history.push('/login')
    oldRender()
  }
}
// export const qiankun = {
//   apps: [
//     {
//       name: 'wms',
//       entry: 'http://localhost:8000/',
//       to: '/wms',
//     },
//   ],
//   routes: [
//     {
//       path: '/wms',
//       microApp: 'wms',
//       microAppProps: {
//         autoSetLoading: true,
//         className: 'myContainer',
//         wrapperClassName: 'myWrapper',
//       },
//     },
//   ],
//   lifeCycles: {
//     afterMount: (props: any) => {
//       // console.log(props);
//     },
//   },
// };

export const useQiankunStateForSlave = () => {
  const [globalState, setQiankunGlobalState] = useState({
    currentMenu: 'null',
  })

  return {
    globalState,
    setQiankunGlobalState,
  }
}

// 动态加载登录
export function patchRoutes({ routes }: any) {
  routes[0].routes.unshift({
    path: '/selectDept',
    exact: true,
    component: SelectDept,
  })
  routes.unshift({
    path: '/login',
    exact: true,
    component: Login,
  })
}
