/// <reference path="./typings.d.ts" />

import Layout from './components/Layout'
import Login from './components/Login'
import SelectDept from './components/SelectDept'
import * as Auth from './components/Auth'
export * from './components/Base/index'
export * from './components/Bus/index'
import * as Utils from './utils/common'
import FormRules from './utils/formRules'
import {ScCard} from '@scboson/sc-layout'

export { default as Authority } from './components/Auth/Authority'
export { default as AuthButton } from './components/Auth/AuthButton'
export { default as ToolBar } from './components/Base/ToolBar'
export { default as BsTable } from './components/Base/BsTable'
export { default as BsSearch } from './components/Base/BsSearch'
export { default as ModalPageContainer } from './components/Base/Tpl/ModalPageTpl'
export { default as useDictModel } from './components/Dict/userDictModel'
import { render, patchRoutes, onRouteChange } from './components/AppStart'
export { PageContainer } from '@scboson/sc-layout'
import { request, useRequest } from './utils/request'
import {
  getService,
  getServiceApi,
  uesRequest as useServiceRequest,
} from './utils/service'
const AppStart = { onRouteChange, render, patchRoutes }
export {
  Layout,
  Auth,
  Utils,
  SelectDept,
  Login,
  request,
  useRequest,
  useServiceRequest,
  getService,
  getServiceApi,
  AppStart,
  FormRules,
  ScCard
}
