/* eslint-disable import/no-dynamic-require */
import React from 'react';
import {SchemaContext} from '@scboson/sc-schema'
import {AppStart,BsTable,Auth} from '@micro-frame/sc-runtime'
{{#localLayout}}
import MasterApp from './layout/layout/MasterApp'


{{/localLayout}}
import {history} from 'umi'

const {render} = AppStart

const { Operation } = BsTable



export function rootContainer(container: any) {

{{#localLayout}}
  window.syscode="{{appSelected}}"
    Auth.setUserAppCode("{{appSelected}}")
   return React.createElement(MasterApp,{localMenuData:{{localMenuData}}},container);
{{/localLayout}}


{{^localLayout}}
  return React.createElement(SchemaContext.Provider,{value:{
   umi:{history},
    tableOpColCmp:Operation
  }},container);
{{/localLayout}}
} 


{{#localLayout}}
 const patchRoutes=AppStart.patchRoutes
 const onRouteChange=AppStart.onRouteChange
 export {
 render,patchRoutes,onRouteChange
}
{{/localLayout}}

{{^localLayout}}
 export {
 
}
{{/localLayout}}

	


