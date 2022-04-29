import React from 'react';
import { getUser, updateCurrentDept, clearUser, DeptInfoProps } from '../Auth';
import { uesRequest } from '../../utils/api';
import logo from '../../assets/logo.svg';
import Avatar from '../Layout/GlobalHeader/AvatarDropdown';
// @ts-ignore
import { history } from 'umi';
import './index.less';
import { message, Layout, Card, List } from 'antd';
const { Header, Content } = Layout;

const SelectDept: React.FC<any> = (props) => {
  const user = getUser();
  const { run } = uesRequest('user', 'chooseDept');
  const logout = uesRequest('user', 'logout');
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
  const layoutFn = () => {
    logout.run().then(() => {
      clearUser();
      history.push('/login');
    });
  };

  const renderDept = () => {
    if (user && user.optionalDepts) {
      const depList = user.optionalDepts;
      const currentDept = user.chooseDeptVO?.currentDept;
      // const itemsList = depList.map((val) => {
      //   const { bizDeptId, bizDeptName, bizDeptTypeName } = val;
      //   let className = 'org-list-item';
      //   if (currentDept?.bizDeptId === bizDeptId) {
      //     className = 'org-list-item action';
      //   }
      //   return (
      //     <div
      //       className={className}
      //       key={bizDeptId}
      //       title={bizDeptName}
      //       onClick={() => {
      //         selectOrg(bizDeptId);
      //       }}
      //     >
      //       <div className="name">{bizDeptName}</div>
      //       <div className="desc-item">机构类型:{bizDeptTypeName || ''}</div>
      //     </div>
      //   );
      // });
      return (
        <List<DeptInfoProps>
          rowKey="bizDeptId"
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 6,
            xxl: 6,
          }}
          dataSource={depList}
          renderItem={(item) => (
            <List.Item key={item.bizDeptId}>
              <Card
                className={
                  currentDept?.bizDeptId === item.bizDeptId ? 'card-action' : ''
                }
                hoverable
                bodyStyle={{ paddingBottom: 20 }}
                onClick={() => {
                  selectOrg(item.bizDeptId);
                }}
              >
                <Card.Meta
                  title={item.bizDeptName}
                  description={`机构类型:${item.bizDeptTypeName || ''}`}
                />
              </Card>
            </List.Item>
          )}
        />
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
            <Avatar currentUser={user} menu={true} layoutFn={layoutFn} />
          </div>
        </Header>
        <Content className="ant-pro-basicLayout-content layout-select-content">
          <Card title="机构列表">
            <div className="select-wrapper">{renderDept()}</div>
          </Card>
        </Content>
      </Layout>
    </div>
  );
};

export default SelectDept;
