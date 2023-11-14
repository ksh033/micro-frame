
import React,{ useEffect, useState } from "react";

import { history } from "./history";

//@ts-ignore
import { setModelState } from "@@/plugin-qiankun-slave/qiankunModel";
import { BsTable } from "@micro-frame/sc-runtime";
import { SchemaContext } from "@scboson/sc-schema";
const { Operation } = BsTable;
//@ts-ignore
import { Outlet, useLocation,useParams } from "umi";
import { dataflowProvider } from "@@/plugin-model/runtime";
import { Layout } from "@micro-frame/sc-runtime";

export default function MicroApp(componentProps: any) {


  const { userConfig:{localMenuData} } = componentProps;
  const location = useLocation()

  const params=useParams()
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
        umi: { history,renderProvider:(con)=>{
          return dataflowProvider(con,{})
        } },
        tableOpColCmp: Operation,
      }}
    >
      <Layout {...componentProps}>

          <Outlet context={{location,params}}></Outlet>

      </Layout>
    </SchemaContext.Provider>
  );

}
