import React from 'react';

import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { GetUser } from '../../Auth';
import HeaderDropdown from '../HeaderDropdown';
// @ts-ignore
import { history } from 'umi';
import './index.less';

export interface GlobalHeaderRightProps extends Partial<any> {
  currentUser?: GetUser | null;
  menu?: boolean;
}
class AvatarDropdown extends React.Component<
  GlobalHeaderRightProps & {
    layoutFn: () => void;
  }
> {
  onMenuClick = (event: any) => {
    const { key } = event;
    if (key === 'logout') {
      this.props.layoutFn();
    } else if (key === 'settings') {
      history.push('/system/current');
    } else if (key === 'changeDept') {
      history.push('/selectDept');
    }
  };

  render(): React.ReactNode {
    const { currentUser, menu } = this.props;
    // const userAppInfo=currentUser?.userAppInfo;
    const menuHeaderDropdown = (
      <Menu className="menu" selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && currentUser && currentUser.optionalDepts.length > 1 ? (
          <Menu.Item key="changeDept">
            <SettingOutlined />
            切换机构
          </Menu.Item>
        ) : null}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}

        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.realName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className="action account">
          <Avatar
            size="small"
            className="avatar"
            icon={<UserOutlined></UserOutlined>}
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
