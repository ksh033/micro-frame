/* eslint-disable import/no-dynamic-require */
import React from 'react';
import {SchemaContext} from '@scboson/sc-schema'
import {AppStart} from '@micro-frame/sc-runtime'
import {BsTable} from '@micro-frame/sc-runtime'
import {history} from 'umi'

const {onRouteChange,render} = AppStart

const { Operation } = BsTable



 export function rootContainer(container: any) {
  return React.createElement(SchemaContext.Provider, {
    value:{
    umi:{history},
    tableOpColCmp:Operation
  }}, container);
}
let  patchRoutes=()=>{

}
 if (process.env.NODE_ENV === 'development') {
    patchRoutes=AppStart.patchRoutes
}

export {
 render,patchRoutes,onRouteChange
}