
import React,{ useEffect, useState } from "react";
//@ts-ignore
import { history } from "@@/core/history";
//@ts-ignore
import { setModelState } from "@@/plugin-qiankun-slave/qiankunModel";
import { BsTable } from "@micro-frame/sc-runtime";
import { SchemaContext } from "@scboson/sc-schema";
const { Operation } = BsTable;
//@ts-ignore
import { Outlet, useLocation } from "umi";

import { Layout } from "@micro-frame/sc-runtime";

export default function MicroApp(componentProps: any) {


  const { localMenuData } = componentProps;
  const location = useLocation()
  const [globalState, setQiankunGlobalState] = useState({
    currentMenu: "null",
    localMenuData,
  });

  useEffect(() => {
    setModelState({
      globalState: { ...globalState, localMenuData },
      setQiankunGlobalState,
    });
  }, [globalState]);

  return (
    <SchemaContext.Provider
      value={{
        umi: { history },
        tableOpColCmp: Operation,
      }}
    >
      <Layout {...componentProps}>

          <Outlet context={{location}}></Outlet>

      </Layout>
    </SchemaContext.Provider>
  );

}
