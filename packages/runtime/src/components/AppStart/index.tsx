import SelectDept from "../SelectDept";
import Login from "../Login";
import React from "react";
import RetrievePassword from "../Login/retrievepassword";
import { getUser } from "../Auth";
import NoFoundPage from "../Layout/404";
// @ts-ignore
import { history  } from "@@/core/history";
export function onRouteChange({ location }: any) {
  // if (matchedRoutes.length) {
  // document.title = matchedRoutes[matchedRoutes.length - 1].route.title || '';
  // }
  // if (location.pathname !== '/selectDept') {
  //   const currentUser = getUser()
  //   if (currentUser && currentUser.userAppInfo) {
  //     const { currentDept, needChooseDept } = currentUser.userAppInfo
  //     if (!currentDept && needChooseDept) {
  //       history.push('/selectDept')
  //     }
  //   }
  // }
}

export function render(oldRender: any) {
  const currentUser = getUser();
  if (currentUser) {
    //if (currentUser && currentUser.userAppInfo.currentDept) {
    // currentUser.currentSystem.
    //history.push(`/${currentUser.userAppInfo.currentSystem.systemCode}`);
    // }
    //console.log(getRoutes().)
    oldRender();
  } else {
    history.push({
      pathname: "/login",
      query: history.location.query,
    });
    oldRender();
  }
}


// 动态加载登录
export function patchClientRoutes({ routes }: any) {
  routes.unshift({
    path: "/retrievepassword",
    exact: true,
    element: <RetrievePassword />,
  });
  routes.unshift({
    path: "/selectDept",
    exact: true,
    element: <SelectDept />,
  });
  routes.unshift({
    path: "/login",
    exact: true,
    element: <Login />,
  });
  routes.unshift({
    path: "/404",
    exact: true,
    element: <NoFoundPage />,
  });
}

// // 动态加载登录
// export function patchRoutes({ routes }: any) {

  
//   routes.unshift({
//     path: "/retrievepassword",
//     exact: true,
//     component: RetrievePassword,
//   });
//   routes.unshift({
//     path: "/selectDept",
//     exact: true,
//     component: SelectDept,
//   });
//   routes.unshift({
//     path: "/login",
//     exact: true,
//     component: Login,
//   });
// }
