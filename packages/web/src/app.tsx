import { useState } from 'react';
//@ts-ignore
import {
  Auth,
  Login,
  SelectDept,
  RetrievePassword,
} from '@micro-frame/sc-runtime';
import { history } from 'umi';
import moment from 'moment';
const { getUser, getUserAppCode } = Auth;

window.masterHistory = history;

let masterUrl = SC_MASTER_URL || '';
// @ts-ignore
window.masterWindow = window;

export const qiankun = new Promise((resolve) => {
  const data = [
    { systemCode: 'basesys', systemName: '基础数据应用' },
    { systemCode: 'mallsys', systemName: '商城管理应用' },
    { systemCode: 'purchasesys', systemName: '采购应用' },
    { systemCode: 'wmssys', systemName: '仓库应用' },
    { systemCode: 'shopsys', systemName: '门店应用' },
    { systemCode: 'factorysys', systemName: '加工中心应用' },
    { systemCode: 'financesys', systemName: '财务应用' },
    { systemCode: 'bisys', systemName: '数据中心' },
    { systemCode: 'deliverysys', systemName: '配送应用' },
  ];
  const apps: any[] = [];
  const routes: any[] = [];
  const { protocol, host } = window.location;
  masterUrl = `${protocol}//${host}/`;
  data.forEach((item: { systemCode: any; systemName: any }) => {
    const { systemCode } = item;
    // console.log(`${masterUrl}micro-${systemCode}/`)

    apps.push({
      name: systemCode,
      to: `/${systemCode}`,
      entry: `${masterUrl}micro-${systemCode}/?version=${moment().format(
        'YYYYMMDD'
      )}`,
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
  resolve({
    apps,
    routes,

    excludeAssetFilter: (assetUrl: string) => {
      if (assetUrl.indexOf('127.0.0.1') > -1) {
        return true;
      }
      return false;
    },
    lifeCycles: {
      beforeLoad: (app: any, scope: any) => {
        scope.userAppCode = getUserAppCode();
        // @ts-ignore
        window.userAppCode = getUserAppCode();
      },

      afterMount: (props: any, scope: any) => {
        scope.userAppCode = getUserAppCode();
        // 主应用userAppCode
        // @ts-ignore
        window.userAppCode = getUserAppCode();
      },
    },
  });
});
export function onRouteChange({ location }: any) {
  // if (matchedRoutes.length) {
  // document.title = matchedRoutes[matchedRoutes.length - 1].route.title || '';
  // }
  if (location.pathname !== '/system/current/initpassword') {
    const currentUser = getUser();
    if (currentUser) {
      if (currentUser.needModifyPwd) {
        history.push('/system/current/initpassword');
      }
    }
  }
}

export function render(oldRender: any) {
  const currentUser = getUser();
  if (currentUser) {
    oldRender();
  } else {
    history.push({
      pathname: '/login',
      query: history.location.query,
    });
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

//const temCode = restUserAppCode()
export const useQiankunStateForSlave = () => {
  const [globalState, setQiankunGlobalState] = useState({
    currentMenu: 'null',
    //currentApp: temCode,
  });

  return {
    globalState,
    setQiankunGlobalState,
  };
};

// eslint-disable-next-line func-names
window.onunload = function () {
  console.log('restUserAppCode');
  //restUserAppCode(getUserAppCode())
};

// 动态加载登录
export function patchRoutes({ routes }: any) {
  routes.unshift({
    path: '/retrievepassword',
    exact: true,
    component: RetrievePassword,
  });
  routes.unshift({
    path: '/selectDept',
    exact: true,
    component: SelectDept,
  });
  routes.unshift({
    path: '/login',
    exact: true,
    component: Login,
  });
}
