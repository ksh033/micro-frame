import { useState } from 'react';
import { Auth,Login,SelectDept } from '@micro-frame/sc-runtime';

import { history } from 'umi';
import { getServiceApi } from './utils/api';
console.log(Auth)
const {getUser}=Auth
console.log(getUser)

export const qiankun = getServiceApi('system', 'getApplist')().then(({ data }:any) => {
  const apps: any[] = [];
const routes: any[] = [];
  data.forEach((item: { systemCode: any; systemName: any }) => {
    const { systemCode } = item;
    apps.push({ name: systemCode, to: `/${systemCode}`, entry: 'http://localhost:8000/' });
    routes.push({
      path: `/${systemCode}`,
      microApp: systemCode,
    });
  });
  return {
    apps,
    routes,
    lifeCycles: {
      afterMount: (props: any) => {
        // console.log(props);
      },
    },
  };
}).catch(() => {})
export function onRouteChange({ location }:any) {
  // if (matchedRoutes.length) {
    // document.title = matchedRoutes[matchedRoutes.length - 1].route.title || '';
  // }
if (location.pathname !== '/selectDept') {
  const currentUser = getUser();
  if (currentUser) {
    const { currentDept, needChooseDept } = currentUser.userAppInfo;
    if (!currentDept && needChooseDept) {
       history.push('/selectDept');
    }
  }
}
}


export function render(oldRender:any) {
  const currentUser = getUser();
  if (currentUser) {
    if (currentUser && currentUser.userAppInfo.currentDept) {
      // currentUser.currentSystem.
      history.push(`/${currentUser.userAppInfo.currentSystem.systemCode}`);
    }
    oldRender();
  } else {
    history.push('/login');
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

export const useQiankunStateForSlave = () => {
  const [globalState, setQiankunGlobalState] = useState({
    slogan: 'Hello MicroFrontend',
  });

  return {
    globalState,
    setQiankunGlobalState,
  };
};


// 动态加载登录
export function patchRoutes({ routes }: any) {
  routes[0].routes.unshift({
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
