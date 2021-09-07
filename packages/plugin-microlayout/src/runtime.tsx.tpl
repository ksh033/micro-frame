/* eslint-disable import/no-dynamic-require */
import React from 'react';
import {SchemaContext} from '@scboson/sc-schema'
import {AppStart,BsTable} from '@micro-frame/sc-runtime'
import MasterApp from './layout/layout/MasterApp'

import {history} from 'umi'

const {render} = AppStart

const { Operation } = BsTable



export function rootContainer(container: any) {

{{#localLayout}}

   return React.createElement(MasterApp,null,container);
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
 render
}
{{/localLayout}}

	


