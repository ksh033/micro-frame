/* eslint-disable import/no-dynamic-require */
{{#localLayout}}
import React from 'react';
import {SchemaContext} from '@scboson/sc-schema';
import {AppStart,BsTable,Auth} from '@micro-frame/sc-runtime';
import MasterApp from './layout/layout/MasterApp';
import {createHistory,history} from "@@/core/history";
import { getPluginManager } from "@@/core/plugin";

//export function rootContainer(container: any) {
//window.syscode="{{appSelected}}"
//Auth.setUserAppCode("{{appSelected}}")
//return React.createElement(MasterApp,{localMenuData:{{localMenuData}}},container);
//} 
 const patchClientRoutes=AppStart.patchClientRoutes
 const onRouteChange=AppStart.onRouteChange

 const render=(oldRender)=>{
  const pluginManager  = getPluginManager();
  
        AppStart.render(oldRender)

 }

 export {
 render,patchClientRoutes,onRouteChange
}
{{/localLayout}}
{{^localLayout}}
//import React from 'react';

//import {SlaveLayout,NoFoundPage} from '@micro-frame/sc-runtime';
//import { connectMaster } from "@@/plugin-qiankun-slave";
export function patchRoutes({ routes, routeComponents }: any) {
 // const layoutId="layout"
 // Object.keys(routes).forEach((key)=>{
    
  //  routes[key].parentId=layoutId
 // })


//const Layout=connectMaster(SlaveLayout)
 // routes[layoutId]={ 
 //    path: "/",
 //    id:layoutId,
 //        element: <Layout />,
 //     isLayout: true,
 // }

//const NoFoundPageData=routes["404"]||{}
//routes["404"]={ 
//  ...NoFoundPageData,
//    parentId:layoutId,
//         element: <NoFoundPage />,

//  }

 }


{{/localLayout}}

	
export function modifyContextOpts(memo: any) {


  // 每次应用 render 的时候会调 modifyClientRenderOpts，这时尝试从队列中取 render 的配置
 // const clientRenderOpts = contextOptsStack.shift();

 let opts={

 }
 if (window.routerBase){
  opts.basename=window.routerBase;
 }
  return {
    ...memo,
    ...opts

  };
}


