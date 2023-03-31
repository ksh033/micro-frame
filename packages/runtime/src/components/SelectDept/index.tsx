import React, { useEffect, useState } from 'react';
import { getUser, updateCurrentDept, clearUser, DeptInfoProps } from '../Auth';
import { uesRequest } from '../../utils/api';
// @ts-ignore
import { history } from 'umi';
import './index.less';
import { message, Card, List, Badge, Divider, Tooltip } from 'antd';
import classnames from 'classnames';
import NotMenuLayouy from '../Layout/NoMenuLayout';

// 排序列表
const sort = [
  'COMPANY', // 集团
  'SUPPLY_CHAIN_COMPANY', // 供应链公司
  'SUPPLY_SUBCOMPANY', // 供应链子公司
  'WAREHOUSE', // 仓库
  'CHAIN_MANAGE_COMPANY', // 连锁管理公司
  'SHOP', // 门店
  'STATION', // 站点
  'SUPPLIER', // 加工中心
];
/** 机构对应的背景图 */
const imageMap = {
  COMPANY: require('../../assets/selectDept/company.svg'),
  SUPPLY_SUBCOMPANY: require('../../assets/selectDept/supply_chain_company.svg'), // 子公司
  SUPPLY_CHAIN_COMPANY: require('../../assets/selectDept/supply_chain_company.svg'), // 供应链公司
  WAREHOUSE: require('../../assets/selectDept/warehouse.svg'), // 仓库
  CHAIN_MANAGE_COMPANY: require('../../assets/selectDept/chain_chain_company.svg'), // 连锁管理公司
  SHOP: require('../../assets/selectDept/shop.svg'), // 门店
  STATION: require('../../assets/selectDept/shop.svg'), // 站点
  SUPPLIER: require('../../assets/selectDept/supply_chain_company.svg'), // 加工中心
};

/** 机构对应的背景图 */
const colorMap = {
  COMPANY: { left: '#2F54EB', right: 'rgba(47,84,235,0)' },
  SUPPLY_SUBCOMPANY: { left: '#3EBC80', right: 'rgba(62,188,128,0)' }, // 子公司
  SUPPLY_CHAIN_COMPANY: { left: '#2F54EB', right: 'rgba(47,84,235,0)' }, // 供应链公司
  WAREHOUSE: { left: '#E94250', right: 'rgba(233,66,80,0)' }, // 仓库
  CHAIN_MANAGE_COMPANY: { left: '#6B2FEB', right: 'rgba(107,47,235,0)' }, // 连锁管理公司
  SHOP: { left: '#F9A225', right: 'rgba(249,162,37,0)' }, // 门店
  STATION: { left: '#DC33DF', right: 'rgba(219, 51, 222,0)' }, // 站点
  SUPPLIER: { left: '#22CED9', right: 'rgba(34, 206, 217,0)' }, // 加工中心
};

const SelectDept: React.FC<any> = (props) => {
  const classPrefix = 'select-wrapper';

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
                <div key={bizDeptType} className={`${classPrefix}-item`}>
                  <div className={`${classPrefix}-item-title`}>
                    {groupMap[bizDeptType].bizDeptTypeName}
                  </div>
                  <div className={`${classPrefix}-item-content`}>
                    {groupMap[bizDeptType].list.map((item, idx) => {
                      return (
                        <Tooltip
                          placement="top"
                          title={item.bizDeptName}
                          key={item.bizDeptId + '-' + idx}
                        >
                          <div
                            className={classnames(`${classPrefix}-item-child`, {
                              'card-action':
                                currentDept?.bizDeptId === item.bizDeptId,
                            })}
                            key={'child-cont-' + item.bizDeptId + '-' + idx}
                            onClick={() => {
                              selectOrg(item.bizDeptId);
                            }}
                          >
                            {/* <img
                              src={imageMap[bizDeptType]}
                              className={`${classPrefix}-item-child-image`}
                            ></img> */}
                            {/*背景*/}
                            <div className={`${classPrefix}-item-child-image`}>
                              {colorMap[bizDeptType] && (
                                <div
                                  className={`${classPrefix}-item-child-image-cont`}
                                  style={{
                                    background: `linear-gradient(220deg, ${colorMap[bizDeptType].left} 0%, ${colorMap[bizDeptType].right} 100%)`,
                                  }}
                                ></div>
                              )}
                            </div>
                            <div className={`${classPrefix}-item-child-text`}>
                              {item.bizDeptName}
                            </div>
                            {Number(item.todoNumber || 0) > 0 && (
                              <div
                                className={`${classPrefix}-item-child-badge`}
                              >
                                {Number(item.todoNumber || 0)}
                              </div>
                            )}
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>
                  {/* <Badge
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
                  /> */}
                </div>
              );
            }
            return null;
          })}
        </>
      );
    }
    return <div className="inner-wrapper"></div>;
  };

  return (
    <NotMenuLayouy>
      {/* <Card title="机构列表" bodyStyle={{ padding: '0 24px' }}> */}
      <div className={classPrefix}>
        {renderDept()}
        <img
          src={require('../../assets/logo-bg.svg')}
          className={`${classPrefix}-bg`}
        ></img>
      </div>
      {/* </Card> */}
    </NotMenuLayouy>
  );
};

export default SelectDept;
