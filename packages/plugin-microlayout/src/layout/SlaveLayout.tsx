
import React from "react";
import { history } from "./history";

import { BsTable } from "@micro-frame/sc-runtime";
import { SchemaContext } from "@scboson/sc-schema";
const { Operation } = BsTable;
//@ts-ignore
import { Outlet, useLocation } from "umi";

import { SlaveLayout } from "@micro-frame/sc-runtime";

export default function MicroApp(componentProps: any) {



  const location = useLocation()

  return (
    <SchemaContext.Provider
      value={{
        umi: { history },
        tableOpColCmp: Operation,
      }}
    >
      <SlaveLayout {...componentProps}>

          <Outlet context={{location}}></Outlet>

      </SlaveLayout>
    </SchemaContext.Provider>
  );

}
