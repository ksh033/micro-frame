/// <reference path="./typings.d.ts" />

import Layout from './components/Layout'
import Login from './components/Login'
import SelectDept from './components/SelectDept'
import * as Auth from './components/Auth'

export {default as Authority} from './components/Base/Authority'

export {default as ToolBar} from './components/Base/ToolBar'

export {default as BsTable} from './components/Base/BsTable'
export {default as BsSearch} from './components/Base/BsSearch'
export {default as ModalPageContainer} from './components/Base/Tpl/ModalPageTpl'
export { PageContainer } from '@scboson/sc-layout'
import { request,useRequest} from './utils/request'

export  {
    Layout, Auth, SelectDept, Login,request, useRequest

}

