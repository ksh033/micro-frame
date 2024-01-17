import React from "react";

import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Avatar, Menu, Spin } from "antd";
import { GetUser } from "../../Auth";
import HeaderDropdown from "../HeaderDropdown";
import logo from "../../../assets/BiazfanxmamNRoxxVxka.png";
// @ts-ignore
import { history } from "@@/plugin-microlayout/umi";
import "./index.less";
import { ItemType } from "antd/es/menu/hooks/useItems";

export interface GlobalHeaderRightProps extends Partial<any> {
  currentUser?: GetUser | null;
  menu?: boolean;
}
class AvatarDropdown extends React.Component<
  GlobalHeaderRightProps & {
    layoutFn: () => void;
  }
> {
  frontDownload() {
    var a = document.createElement("a"); //创建一个<a></a>标签
    a.href = `${window.location.origin}/长嘴猫客户端-v1.7.1.2.exe`; // 给a标签的href属性值加上地址，注意，这里是绝对路径，不用加 点.
    a.style.display = "none"; // 障眼法藏起来a标签
    document.body.appendChild(a); // 将a标签追加到文档对象中
    a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
    a.remove(); // 一次性的，用完就删除a标签
  }

  onMenuClick = (event: any) => {
    const { key } = event;
    if (key === "logout") {
      this.props.layoutFn();
    } else if (key === "settings") {
      history.push("/system/current");
    } else if (key === "changeDept") {
      history.push("/selectDept");
    } else if (key === "downloadPlugIN") {
      this.frontDownload();
    }
  };

  render(): React.ReactNode {
    const { currentUser, menu } = this.props;
    // const userAppInfo=currentUser?.userAppInfo;
    let items: ItemType[] = [];

    if (menu) {
      items.push({
        key: 'settings',
        icon: <UserOutlined />,
        label: '个人设置'
      })
      items.push({
        key: 'downloadPlugIN',
        icon: <DownloadOutlined />,
        label: '下载打印插件'
      })
      items.push({
        type: 'divider'
      })
      items.push({
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录'
      })
      // items.push(<Menu.Item key="downloadPlugIN">
      //   <DownloadOutlined />
      //   <text className="menu-text">下载打印插件</text>
      // </Menu.Item>)
      // items.push(<Menu.Divider />)
      // items.push(<Menu.Item key="logout">
      //   <LogoutOutlined />
      //   退出登录
      // </Menu.Item>)

      if (currentUser && currentUser.optionalDepts.length > 1) {
        items.unshift(
          {
            key: 'changeDept',
            icon: <SettingOutlined />,
            label: '切换机构'
          }
        )
      }

    }
    const menuHeaderDropdown = (
      <Menu className="menu" selectedKeys={[]} items={items} onClick={this.onMenuClick}>

      </Menu>
    );
    return currentUser && currentUser.realName ? (
      <HeaderDropdown menu={{
        onClick: this.onMenuClick,
        items,
        className: 'menu'
      }} placement="bottom" >
        <span className="action account">
          <Avatar
            style={{ marginRight: "8px" }}
            size="small"
            className="avatar"
            src={logo}
            alt="avatar"
          />
          <span className="name">
            {currentUser.realName}[
            {currentUser?.chooseDeptVO?.currentDept?.bizDeptName}]
          </span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className="action account">
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default AvatarDropdown;
