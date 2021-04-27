import SelectDept from '../SelectDept'
import Login from '../Login'
import {getUser} from '../Auth'
// @ts-ignore
import {history} from 'umi'
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
      //if (currentUser && currentUser.userAppInfo.currentDept) {
      // currentUser.currentSystem.
      //history.push(`/${currentUser.userAppInfo.currentSystem.systemCode}`);
      // }
      //console.log(getRoutes().)
      oldRender()
    } else {
      history.push('/login')
      oldRender()
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