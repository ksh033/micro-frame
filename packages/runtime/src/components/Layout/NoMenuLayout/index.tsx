import { Layout } from 'antd';
import React, { PropsWithChildren } from 'react';
const { Header, Content } = Layout;
import Avatar from '../GlobalHeader/AvatarDropdown';
import logo from '../../../assets/logo.svg';
import { getUser, clearUser } from '../../Auth';
import { uesRequest } from '../../../utils/api';
// @ts-ignore
import { history } from 'umi';

const NotMenuLayouy: React.FC<PropsWithChildren<any>> = (props) => {
  const user = getUser();
  const logout = uesRequest('user', 'logout');
  const layoutFn = () => {
    logout.run().then(() => {
      clearUser();
      history.push('/login');
    });
  };
  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
      <Layout className="ant-pro-basicLayout ">
        <Header
          className="ant-pro-fixed-header ant-pro-top-nav-header light"
          style={{ height: '48px', lineHeight: '48px', padding: 0 }}
        >
          <div
            className="ant-pro-top-nav-header-main"
            style={{
              justifyContent: 'space-between',
              paddingRight: '24px',
              paddingLeft: '24px',
            }}
          >
            <div
              className="ant-pro-top-nav-header-main-left ant-pro-top-nav-header-logo"
              style={{ alignItems: 'center' }}
            >
              <img src={logo}></img>
              <h1>长嘴猫平台</h1>
            </div>
            <Avatar currentUser={user} menu={true} layoutFn={layoutFn} />
          </div>
        </Header>
        <Content className="ant-pro-basicLayout-content layout-select-content">
          {props.children}
        </Content>
      </Layout>
    </div>
  );
};
export default NotMenuLayouy;
