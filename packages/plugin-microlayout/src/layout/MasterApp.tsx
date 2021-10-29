import React, { useEffect, useState } from "react";
//@ts-ignore
import {history} from 'umi'
//@ts-ignore
import { setModelState } from '@@/plugin-qiankun/qiankunModel';
import {SchemaContext} from '@scboson/sc-schema'
import { AppStart, BsTable } from '@micro-frame/sc-runtime'
const { Operation } = BsTable
export default function MicroApp(componentProps: any) {

  
  const { children,localMenuData } = componentProps;
  const [globalState, setQiankunGlobalState] = useState({
    currentMenu: "null",
    localMenuData
  });
  
  useEffect(()=>{
    setModelState({...globalState,setQiankunGlobalState})
  },[globalState])
 

  return <SchemaContext.Provider value={
    {
      umi:{history},
      tableOpColCmp:Operation
}

  }>   {children}</SchemaContext.Provider>;
}
