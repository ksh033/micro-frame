import { useState } from "react";
import {
  Auth,
  Login,
  SelectDept,
  getServiceApi,
} from "@micro-frame/sc-runtime";
import { history } from "umi";

const { getUser, restUserAppCode, getUserAppCode } = Auth;

window.masterHistory = history;

const masterUrl = SC_MASTER_URL || "";
// @ts-ignore
window.masterWindow = window;

export const qiankun = getServiceApi("system", "getApplist")()
  .then((data: any) => {
    const apps: any[] = [];
    const routes: any[] = [];
    data.forEach((item: { systemCode: any; systemName: any }) => {
      const { systemCode } = item;
      // console.log(`${masterUrl}micro-${systemCode}/`)
    
        apps.push({
          name: systemCode,
          to: `/${systemCode}`,
          entry: `${masterUrl}micro-${systemCode}/`,
          activeRule: `/${systemCode}`,
          // entry: `${masterUrl}${systemCode}/`,
          // activeRule: `/micro-${systemCode}`,
        });
     

      routes.push({
        path: `/${systemCode}`,
        microApp: systemCode,
        microAppProps: {
          autoSetLoading: true,
          autoCaptureError: true,
        },
      });
    });
    return {
      apps,
      routes,
     
      excludeAssetFilter: (assetUrl: string) => {
        if (assetUrl.indexOf("127.0.0.1") > -1) {
          return true;
        }
        return false;
      },
      lifeCycles: {
        beforeLoad: (app: any, scope: any) => {
          // console.log("master beforeLoad")
          //console.log(window.location);

          // loading=true;
          // 子应用 syscode
          // eslint-disable-next-line no-param-reassign
          scope.syscode = app.name;
          // 主应用 syscode
          // @ts-ignore
          window.syscode = app.name;
        
        },
        
        afterMount: (props: any, scope: any) => {
          // @ts-ignore
          // 子应用userAppCode
          // eslint-disable-next-line no-param-reassign
          scope.userAppCode = getUserAppCode();

          // 主应用userAppCode
          // @ts-ignore
          window.userAppCode = getUserAppCode();
       
          // loading=false;
          // console.log(scope);

          // console.log(getUserAppCode());
          // console.log("master afterMount");
          // console.log(props);
        },
      },
    };
  })
  .catch(() => {});
export function onRouteChange({ location }: any) {
  // if (matchedRoutes.length) {
  // document.title = matchedRoutes[matchedRoutes.length - 1].route.title || '';
  // }
  if (location.pathname !== "/system/current/initpassword") {
    const currentUser = getUser();
    if (currentUser) {
      if (currentUser.needModifyPwd){
        history.push("/system/current/initpassword");
      }
    }
  }
 }

export function render(oldRender: any) {
  const currentUser = getUser();
  if (currentUser) {
   
    oldRender();
  } else {
    history.push("/login");
    oldRender();
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

const temCode = restUserAppCode();
export const useQiankunStateForSlave = () => {
  const [globalState, setQiankunGlobalState] = useState({
    currentMenu: "null",
    currentApp: temCode,
  });

  return {
    globalState,
    setQiankunGlobalState,
  };
};

// 动态加载登录
export function patchRoutes({ routes }: any) {
  routes[0].routes.unshift({
    path: "/selectDept",
    exact: true,
    component: SelectDept,
  });
  routes.unshift({
    path: "/login",
    exact: true,
    component: Login,
  });
}
