/* eslint-disable import/no-dynamic-require */
import React from 'react';
import {SchemaContext} from '@scboson/sc-schema'
import {AppStart} from '@micro-frame/sc-runtime'
import {BsTable} from '@micro-frame/sc-runtime'
import {history} from 'umi'

const {onRouteChange,render,patchRoutes} = AppStart

const { Operation } = BsTable



 export function rootContainer(container: any) {

  return React.createElement(SchemaContext.Provider, {
    value:{
    umi:{history},
    tableOpColCmp:Operation
  }}, container);
}


export {
 render,patchRoutes,onRouteChange
}