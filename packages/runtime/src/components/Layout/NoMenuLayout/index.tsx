import { Layout } from "antd";
import React, { PropsWithChildren } from "react";
const { Header, Content } = Layout;
import Avatar from "../GlobalHeader/AvatarDropdown";
import { ProLayout } from '@ant-design/pro-layout';
import { ProConfigProvider } from '@ant-design/pro-provider'

import { ConfigProvider } from 'antd'
import logo from "../../../assets/logo.svg";
import { getUser, clearUser } from "../../Auth";
import { uesRequest } from "../../../utils/api";
// @ts-ignore
import { history } from "umi";

const NotMenuLayouy: React.FC<PropsWithChildren<any>> = (props) => {
  const user = getUser();
  const logout = uesRequest("user", "logout");
  const layoutFn = () => {
    logout.run().then(() => {
      clearUser();
      history.push("/login");
    });
  };
  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById('test-pro-layout') || document.body;
          }}
        >
          <ProLayout

        
token={{header:{heightLayoutHeader:48}}}


            contentStyle={{ padding: '0px', minHeight:'calc(100vh - 48px)' }}
            layout="top"
            logo={logo}
            title="长嘴猫平台"
            actionsRender={() => {

              return [<div className="right" style={{ paddingRight: '24px' }}><Avatar currentUser={user} menu={true} layoutFn={layoutFn} /></div>]
            }}



          >
            {props.children}


          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>

    </div>
  );
};
export default NotMenuLayouy;
