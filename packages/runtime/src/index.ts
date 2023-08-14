/// <reference path="./typings.d.ts" />
import "./components/Style/index.less";
import Layout from "./components/Layout";
import SlaveLayout from "./components/Layout/SlaveLayout";

import NoFoundPage from "./components/Layout/404";
import NoMenuLayout from "./components/Layout/NoMenuLayout";
import Login from "./components/Login";
import RetrievePassword from "./components/Login/retrievepassword";
import Loading from "./components/Loading";
import SelectDept from "./components/SelectDept";
import * as AllAuth from "./components/Auth";
export * from "./components/Base/index";
export * from "./components/Bus/index";
import * as Utils from "./utils/common";
import FormRules from "./utils/formRules";
import { getFunCodeAuth } from "./components/Auth/Authority";
export { default as Authority } from "./components/Auth/Authority";
export { default as AuthButton } from "./components/Auth/AuthButton";
export { default as ToolBar } from "./components/Base/ToolBar";
export { default as BsTable } from "./components/Base/BsTable";
export { default as BsSearch } from "./components/Base/BsSearch";
export { default as ModalPageContainer } from "./components/Base/Tpl/ModalPageTpl";
export { default as useDictModel } from "./components/Dict/userDictModel";
export { setFuncodes } from "@scboson/sc-schema";
export { default as PageContainer } from "./components/Base/PageContainer";
export { default as defaultRenderText } from "./components/Dict/defaultRender";
import { render, patchClientRoutes, onRouteChange } from "./components/AppStart";
export {
  ScCard,
  ScCheckCard,
  ScStatisticCard,
  ScStatistic,
} from "@scboson/sc-layout";
export type {
  ScCardTabsProps,
  ScCardProps,
  ScStatisticCardProps,
  ScStatisticsCardProps,
  ScCheckCardGroupProps,
  ScCheckCardProps,
  ScStatisticProps,
} from "@scboson/sc-layout";

import { request, useRequest } from "./request";
import {
  getService,
  getServiceApi,
  uesRequest as useServiceRequest,
} from "./utils/service";
import { setFuncodes } from "@scboson/sc-schema";
import createWxLoginQr from "./wxConfig";

const { openWindow, getBizDeptInfo, ...Auth } = AllAuth;

const AppStart = { onRouteChange, render, patchClientRoutes };
setFuncodes({
  add: {
    funcode: "ADD",
  },
  edit: {
    funcode: "EDIT",
  },
  remove: {
    funcode: "DEL",
  },
  view: {
    funcode: "READ",
  },
  dataImport: {
    funcode: "IMPORT",
  },
  dataExport: {
    funcode: "EXPORT",
  },
  audit: {
    funcode: "AUDIT",
  },
});
export {
  Layout,
  SlaveLayout,
  NoFoundPage,
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
  getFunCodeAuth,
  Loading,
  openWindow,
  getBizDeptInfo,
  createWxLoginQr,
  NoMenuLayout,
  RetrievePassword,
};
