import React, { useState, useEffect } from "react";
import { ProSettings, MasterLayout } from "@scboson/sc-layout";
// @ts-ignore
import { Link, history } from "umi";
import { getUser, changeApp } from "../Auth";
import { uesRequest } from "../../utils/api";
import RightContent from "./GlobalHeader/RightContent";
import logo from "../../assets/logo.svg";

import menuFormat from "./menuFormat";
import userDictModel from "../Dict/userDictModel";

export default (props: any) => {
  const [settings] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
  });
  //isMaster 是否是主应用
  const { children, userConfig, isMaster, ...restProps } = props;
  const { menuData, appData, appSelected } = userConfig||{};
  const user = getUser();
  const req = uesRequest("user", "chooseSys");
  const { loadDict, dict } = userDictModel();
  const systemList = appData || user?.systemList;
  const appSelectedKeys =
    appSelected || user?.userAppInfo.currentSystem.systemCode;
  const apps = systemList.map((sys) => ({
    name: sys.systemName,
    code: sys.systemCode,
    isApp: true,
    path: `/${sys.systemCode}`,
  }));
  const mdata = menuData || user?.userAppInfo.menuTreeNodeList;
  const [appCode, setAppCode] = useState<any>();
  // const [pathname, setPathname] = useState('/welcome');

  useEffect(() => {
    // 加载枚举
    loadDict();
    if (!isMaster) {
      if (appSelected) {
        if (!changeApp(appSelected)) {
          req.run({ systemCode: appSelected }).then((data) => {
            changeApp(appSelected, data);
            history.push("/");
          });
        }
      }
    }
  }, []);
  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
      }}
    >
      <MasterLayout
        logo={logo}
        apps={apps}
        appMenuProps={{
          onSelect: async (keys: any) => {
            if (keys && keys.length > 0) {
              if (!changeApp(keys[0])) {
                const data = await req.run({ systemCode: keys[0] });
                changeApp(keys[0], data);
              }
              history.push("/" + keys[0]);
              //setAppCode(keys[0])
              // console.log(data)
            }
          },
        }}
        appSelectedKeys={[appSelectedKeys]}
        {...restProps}
        menuDataRender={() => {
          const menus = menuFormat.formatMenu(mdata || [], [],isMaster===true?appSelectedKeys:"");
          return menus;
        }}
        menuFooterRender={(_props: any) => {}}
        menuItemRender={(item: any, dom) => {
          if (item.isApp) {
            return <a>{dom}</a>;
          }
          return <Link to={`${item.path}`}>{dom}</Link>;
        }}
        rightContentRender={() => (
          <RightContent currentUser={user} menu></RightContent>
        )}
        {...settings}
        navTheme="light"
      >
        {children}
      </MasterLayout>
    </div>
  );
};
