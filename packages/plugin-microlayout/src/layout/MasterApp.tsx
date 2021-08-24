import React, { useEffect, useState} from "react";

//@ts-ignore
import { setModelState } from '@@/plugin-qiankun/qiankunModel';

 

export default function MicroApp(componentProps: any) {
  const { children } = componentProps;
  const [globalState, setQiankunGlobalState] = useState({
    currentMenu: "null",
  });
  
  useEffect(()=>{
    setModelState({globalState,setQiankunGlobalState})
  },[globalState])
 

  return <>{children}</>;
}
