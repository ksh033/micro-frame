import React from 'react';
import { getUser, updateCurrentDept, clearUser, DeptInfoProps } from '../Auth';
import { uesRequest } from '../../utils/api';
// @ts-ignore
import { history } from 'umi';
import './index.less';
import { message, Card, List, Badge } from 'antd';
import NotMenuLayouy from '../Layout/NoMenuLayout';

const SelectDept: React.FC<any> = (props) => {
  const user = getUser();
  const { run } = uesRequest('user', 'chooseDept');
  const selectOrg = async (deptId: any) => {
    message.loading('切换机构中..', 0);
    let data = await run({ deptId });
    message.destroy();
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
              {Number(item.todoNumber || 0) > 0 ? (
                <Badge.Ribbon
                  text={`${Number(item.todoNumber || 0)}`}
                  color="#cf1322"
                >
                  <Card
                    className={
                      currentDept?.bizDeptId === item.bizDeptId
                        ? 'card-action'
                        : ''
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
                </Badge.Ribbon>
              ) : (
                <Card
                  className={
                    currentDept?.bizDeptId === item.bizDeptId
                      ? 'card-action'
                      : ''
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
              )}
            </List.Item>
          )}
        />
      );
    }
    return <div className="inner-wrapper"></div>;
  };

  return (
    <NotMenuLayouy>
      <Card title="机构列表">
        <div className="select-wrapper">{renderDept()}</div>
      </Card>
    </NotMenuLayouy>
  );
};

export default SelectDept;
