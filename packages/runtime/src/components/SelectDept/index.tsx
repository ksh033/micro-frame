import React from 'react';
import { getUser, updateCurrentDept } from '../Auth';
import { uesRequest } from '../../utils/api';
import logo from '../../assets/logo.svg';
// @ts-ignore
import { history } from 'umi';
import './index.less';
import { message, Layout, Card } from 'antd';
const { Header, Content } = Layout;

const SelectDept: React.FC<any> = (props) => {
  const user = getUser();
  const { run } = uesRequest('user', 'chooseDept');
  const selectOrg = async (deptId: any) => {
    let data = await run({ deptId });
    if (data) {
      const userAppInfos = updateCurrentDept(data);
      if (userAppInfos.currentSystem?.systemCode) {
        history.push(`/${userAppInfos.currentSystem.systemCode}`);
      } else {
        history.push('/');
      }
    } else {
      message.warn('找不到该组织');
    }
  };

  const renderDept = () => {
    if (user && user.optionalDepts) {
      const depList = user.optionalDepts;
      const currentDept = user.chooseDeptVO?.currentDept;
      const itemsList = depList.map((val) => {
        const { bizDeptId, bizDeptName, bizDeptTypeName } = val;
        let className = 'org-list-item';
        if (currentDept?.bizDeptId === bizDeptId) {
          className = 'org-list-item action';
        }
        return (
          <div
            className={className}
            key={bizDeptId}
            title={bizDeptName}
            onClick={() => {
              selectOrg(bizDeptId);
            }}
          >
            <div className="name">{bizDeptName}</div>
            <div className="desc-item">机构类型:{bizDeptTypeName || ''}</div>
          </div>
        );
      });
      return (
        <Card title="机构列表" bordered={false}>
          <div className="inner-content">{itemsList}</div>
        </Card>
      );
    }
    return <div className="inner-wrapper"></div>;
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
            <div className="ant-pro-right-content">{user?.realName}</div>
          </div>
        </Header>
        <Content className="ant-pro-basicLayout-content layout-select-content">
          <div className="select-wrapper">{renderDept()}</div>
        </Content>
      </Layout>
    </div>
  );
};

export default SelectDept;
