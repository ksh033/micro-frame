import React from "react";
import { Map, MapProps } from "react-amap";
import { amapkey } from "../../../utils/common";

const ReactAmapMap: React.FC<MapProps> = (props) => {
  // @ts-ignore
  if (window && window._AMapSecurityConfig == null) {
    // @ts-ignore
    window._AMapSecurityConfig = {
      securityJsCode: "a13a19d373098f6c36835b4eb9132ab5",
    };
  }

  return <Map {...props} amapkey={amapkey}></Map>;
};

export default ReactAmapMap;
