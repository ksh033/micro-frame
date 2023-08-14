/* eslint-disable import/no-duplicates */
/// <reference path="../../../typings.d.ts" />
import React from "react";
import type { GlobalHeaderRightProps } from "./AvatarDropdown";
import { uesRequest } from "../../../utils/api";
import { clearUser } from "../../Auth";
import Avatar from "./AvatarDropdown";
import NoticeIconView from "../NoticeIcon";
import "./index.less";
// @ts-ignore
import { history } from "umi";
import { Button, Space } from "antd";

export type SiderTheme = "light" | "dark";

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout, currentUser, menu } = props;
  const { run } = uesRequest("user", "logout");
  let className = "right";

  if (theme === "dark" && layout === "topmenu") {
    className = `right  dark`;
  }
  const layoutFn = () => {
    run().then(() => {
      clearUser();
      history.push("/login");
    });
  };

  const url = `${window.location.origin}/长嘴猫客户端-v1.7.1.2.exe`;
  return (
    <Space className={className} size="middle">
      {/* <div style={{ marginRight: '8px' }}>
        <a href={url}>下载打印插件</a>
      </div> */}
      <NoticeIconView />
      <Avatar currentUser={currentUser} menu={menu} layoutFn={layoutFn} />
    </Space>
  );
};

export default GlobalHeaderRight;
