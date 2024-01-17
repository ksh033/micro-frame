import { LayoutConfig } from "../types/interface.d";
export default (
  userConfig: LayoutConfig,
  path: string
) => `import React, { useState, useEffect } from "react";
import { useAppData} from "@@/plugin-microlayout/umi";
import {  useModel} from "@@/plugin-model";

import LayoutComponent from '${path}';
import {Auth} from '@micro-frame/sc-runtime';

export default props => {
  const [runtimeConfig, setRuntimeConfig] = useState(null);
  const { pluginManager } = useAppData();
  const initialInfo = (useModel && useModel("@@initialState")) || {
    initialState: undefined,
    loading: false,
    setInitialState: null
  }; // plugin-initial-state 未开启

  useEffect(() => {
    const useRuntimeConfig =
    pluginManager.applyPlugins({
        key: "microlayout",
        type: "modify",
        initialValue: initialInfo
      }) || {};
    if (useRuntimeConfig instanceof Promise) {
      useRuntimeConfig.then(config => {
        setRuntimeConfig(config);
      });
      return;
    }
    setRuntimeConfig(useRuntimeConfig);
  }, [initialInfo?.initialState]);

  const userConfig = {
    ...${JSON.stringify(userConfig).replace(/"/g, "'")},
    ...runtimeConfig || {}
  };

  useEffect(() => {
    window.syscode=userConfig.appSelected
    Auth.setUserAppCode(userConfig.appSelected)
  }, [userConfig]);

  

  if(!runtimeConfig){
    return null
  }

  return React.createElement(LayoutComponent, {
    userConfig,
    ...props
  });
};
`;
