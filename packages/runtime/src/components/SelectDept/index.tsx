import React, { useEffect, useState } from 'react';
import { getUser, updateCurrentDept, clearUser, DeptInfoProps } from '../Auth';
import { uesRequest } from '../../utils/api';
// @ts-ignore
import { history } from 'umi';
import './index.less';
import { message, Card, List, Badge, Divider } from 'antd';
import NotMenuLayouy from '../Layout/NoMenuLayout';

// 排序列表
const sort = [
  'COMPANY', // 集团
  'SUPPLY_SUBCOMPANY', // 子公司
  'SUPPLY_CHAIN_COMPANY', // 供应链公司
  'WAREHOUSE', // 仓库
  'CHAIN_MANAGE_COMPANY', // 连锁管理公司
  'SHOP', // 门店
  'STATION ', // 站点
];

const SelectDept: React.FC<any> = (props) => {
  const user = getUser();
  const { run } = uesRequest('user', 'chooseDept');
  const deptlistApi = uesRequest('user', 'deptlist');

  const [userDeptlist, setDeptlist] = useState<DeptInfoProps[]>([]);

  useEffect(() => {
    deptlistApi.run().then((res) => {
      if (Array.isArray(res)) {
        setDeptlist(res);
      }
    });
  }, []);

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
      const depList =
        userDeptlist.length > 0 ? userDeptlist : user.optionalDepts;
      const currentDept = user.chooseDeptVO?.currentDept;
      console.log('depList', depList);

      const groupMap: Record<
        string,
        { bizDeptTypeName: string; list: DeptInfoProps[] }
      > = {};

      if (Array.isArray(depList)) {
        depList.forEach((item) => {
          if (groupMap[item.bizDeptType]) {
            const list = groupMap[item.bizDeptType].list;
            list.push(item);
            groupMap[item.bizDeptType] = {
              bizDeptTypeName: item.bizDeptTypeName,
              list: list,
            };
          } else {
            groupMap[item.bizDeptType] = {
              bizDeptTypeName: item.bizDeptTypeName,
              list: [item],
            };
          }
        });
      }
      const length = Object.keys(groupMap).length;
      const width = Math.round(95 / length);
      return (
        <>
          {sort.map((bizDeptType: string) => {
            if (groupMap[bizDeptType]) {
              return (
                <div
                  key={bizDeptType}
                  className="select-wrapper-item"
                  style={{ width: width + '%' }}
                >
                  <Badge
                    status="processing"
                    text={
                      <span style={{ fontSize: '16px', fontWeight: 500 }}>
                        {groupMap[bizDeptType].bizDeptTypeName}
                      </span>
                    }
                    style={{ marginBottom: '12px', marginLeft: '12px' }}
                  />
                  <List<DeptInfoProps>
                    rowKey="bizDeptId"
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 1,
                      md: 1,
                      lg: 1,
                      xl: 1,
                      xxl: 1,
                    }}
                    dataSource={groupMap[bizDeptType].list}
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
                              bodyStyle={{ padding: 18 }}
                              onClick={() => {
                                selectOrg(item.bizDeptId);
                              }}
                            >
                              <Card.Meta
                                title={item.bizDeptName}
                                // description={`机构类型:${
                                //   item.bizDeptTypeName || ''
                                // }`}
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
                            bodyStyle={{ padding: 18 }}
                            onClick={() => {
                              selectOrg(item.bizDeptId);
                            }}
                          >
                            <Card.Meta
                              title={item.bizDeptName}
                              // description={`机构类型:${
                              //   item.bizDeptTypeName || ''
                              // }`}
                            />
                          </Card>
                        )}
                      </List.Item>
                    )}
                  />
                </div>
              );
            }
            return null;
          })}
        </>
      );
      // return (
      //   <List<DeptInfoProps>
      //     rowKey="bizDeptId"
      //     grid={{
      //       gutter: 16,
      //       xs: 1,
      //       sm: 2,
      //       md: 3,
      //       lg: 4,
      //       xl: 6,
      //       xxl: 6,
      //     }}
      //     dataSource={depList}
      //     renderItem={(item) => (
      //       <List.Item key={item.bizDeptId}>
      //         {Number(item.todoNumber || 0) > 0 ? (
      //           <Badge.Ribbon
      //             text={`${Number(item.todoNumber || 0)}`}
      //             color="#cf1322"
      //           >
      //             <Card
      //               className={
      //                 currentDept?.bizDeptId === item.bizDeptId
      //                   ? 'card-action'
      //                   : ''
      //               }
      //               hoverable
      //               bodyStyle={{ paddingBottom: 20 }}
      //               onClick={() => {
      //                 selectOrg(item.bizDeptId);
      //               }}
      //             >
      //               <Card.Meta
      //                 title={item.bizDeptName}
      //                 description={`机构类型:${item.bizDeptTypeName || ''}`}
      //               />
      //             </Card>
      //           </Badge.Ribbon>
      //         ) : (
      //           <Card
      //             className={
      //               currentDept?.bizDeptId === item.bizDeptId
      //                 ? 'card-action'
      //                 : ''
      //             }
      //             hoverable
      //             bodyStyle={{ paddingBottom: 20 }}
      //             onClick={() => {
      //               selectOrg(item.bizDeptId);
      //             }}
      //           >
      //             <Card.Meta
      //               title={item.bizDeptName}
      //               description={`机构类型:${item.bizDeptTypeName || ''}`}
      //             />
      //           </Card>
      //         )}
      //       </List.Item>
      //     )}
      //   />
      // );
    }
    return <div className="inner-wrapper"></div>;
  };

  return (
    <NotMenuLayouy>
      {/* <Card title="机构列表" bodyStyle={{ padding: '0 24px' }}> */}
      <div className="select-wrapper">{renderDept()}</div>
      {/* </Card> */}
    </NotMenuLayouy>
  );
};

export default SelectDept;
