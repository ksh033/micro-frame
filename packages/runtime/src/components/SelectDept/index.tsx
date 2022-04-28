import React from 'react';
import { getUser, updateCurrentDept } from '../Auth';
import { uesRequest } from '../../utils/api';
// @ts-ignore
import { history } from 'umi';
import './index.less';
import { message, Layout } from 'antd';
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
        <div className="inner-wrapper">
          <div>
            <div className="inner-title">机构列表</div>
            <div className="inner-content">{itemsList}</div>
          </div>
        </div>
      );
    }
    return <div className="inner-wrapper"></div>;
  };

  return (
    <Layout>
      <Header className="header"></Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="select-wrapper">{renderDept()}</div>;
      </Content>
    </Layout>
  );
};

export default SelectDept;
