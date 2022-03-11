/* eslint-disable import/no-dynamic-require */
{{#localLayout}}
import React from 'react';
import {SchemaContext} from '@scboson/sc-schema';
import {AppStart,BsTable,Auth} from '@micro-frame/sc-runtime';
import MasterApp from './layout/layout/MasterApp';
const {render} = AppStart
export function rootContainer(container: any) {
   window.syscode="{{appSelected}}"
    Auth.setUserAppCode("{{appSelected}}")
   return React.createElement(MasterApp,{localMenuData:{{localMenuData}}},container);
} 
 const patchRoutes=AppStart.patchRoutes
 const onRouteChange=AppStart.onRouteChange
 export {
 render,patchRoutes,onRouteChange
}
{{/localLayout}}
{{^localLayout}}
import React from 'react';
import {dynamic} from 'umi';
import {SlaveLayout,Loading} from '@micro-frame/sc-runtime';

export function patchRoutes({ routes }) {
if (Array.isArray(routes)) {

  let childRoutes=[];
  let len=routes.length;
  for(let i=0;i<len;i++){
    childRoutes.push(routes.shift())
  }
 
  routes.push({
    path: "/",
    component: SlaveLayout,

   routes:childRoutes
 })
  }
  return routes
  
}
{{/localLayout}}

	


