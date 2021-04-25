import React from 'react';

import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { User } from '../../Auth'
import HeaderDropdown from '../HeaderDropdown';
import './index.less'

export interface GlobalHeaderRightProps extends Partial<any> {
  currentUser: User|null;
  menu?: boolean;
}
class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: any) => {
    const { key } = event;
    if (key === 'logout') {
     // const { dispatch } = this.props;

      // if (dispatch) {
       // dispatch({
          // type: 'login/logout',
       // });
     // }

     // return;
    }

    // history.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const { currentUser, menu } = this.props;
    const menuHeaderDropdown = (
      <Menu className="menu" selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
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
          <Avatar size="small" className="avatar" icon={<UserOutlined></UserOutlined>} alt="avatar" />
          <span className="name">{currentUser.realName}
          [{currentUser.userAppInfo.currentDept?.bizDeptName}]</span>
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
