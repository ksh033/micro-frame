import { useEffect, useState } from "react";
//@ts-ignore
import { history } from "@@/core/history";
//@ts-ignore
import { setModelState } from "@@/plugin-qiankun-slave/qiankunModel";
import BsTable from "@micro-frame/sc-runtime/es/components/Base/BsTable";
import { SchemaContext } from "@scboson/sc-schema";
const { Operation } = BsTable;
export default function MicroApp(componentProps: any) {
  const { children, localMenuData } = componentProps;
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
      {children}
    </SchemaContext.Provider>
  );
}
