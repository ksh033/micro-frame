import React, { useEffect, useState } from 'react';
import {
  getUser,
  updateCurrentDept,
  clearUser,
  DeptInfoProps,
  DeptType,
} from '../Auth';
import { uesRequest } from '../../utils/api';
// @ts-ignore
import { history } from 'umi';
import './index.less';
import { message, Card, List, Badge, Divider, Tooltip } from 'antd';
import classnames from 'classnames';
import NotMenuLayouy from '../Layout/NoMenuLayout';
import { findIndex } from 'lodash';

// 排序列表
const sort = [
  'COMPANY', // 集团
  'WAREHOUSE', // 仓库
  'SHOP', // 门店
  'SUPPLIER', // 加工中心
];

/** 机构对应的背景图 */
const imageMap = {
  COMPANY: require('../../assets/selectDept/company.svg'),
  WAREHOUSE: require('../../assets/selectDept/warehouse.svg'), // 仓库
  SHOP: require('../../assets/selectDept/shop.svg'), // 门店
  SUPPLIER: require('../../assets/selectDept/supplier.svg'), // 加工中心
};

/** 机构对应的背景图 */
const colorMap = {
  COMPANY: 'rgba(47, 84, 235, 0.16)',
  WAREHOUSE: 'rgba(233, 66, 80, 0.16)', // 仓库
  SHOP: 'rgba(255, 165, 0, 0.16)', // 门店
  SUPPLIER: 'rgba(62, 188, 128, 0.16)', // 加工中心
};
const getGroupKey = (bizDeptType: DeptType) => {
  const map = {
    COMPANY: 'COMPANY',
    SUPPLY_SUBCOMPANY: 'COMPANY', // 子公司
    SUPPLY_CHAIN_COMPANY: 'COMPANY', // 供应链公司
    WAREHOUSE: 'WAREHOUSE', // 仓库
    CHAIN_MANAGE_COMPANY: 'COMPANY', // 连锁管理公司
    SHOP: 'SHOP', // 门店
    STATION: 'SHOP', // 站点
    SUPPLIER: 'SUPPLIER', // 加工中心
  };
  return map[bizDeptType] || 'COMPANY';
};

const getGroupNameByKey = (key: string) => {
  const map = {
    COMPANY: '企业',
    WAREHOUSE: '仓库', // 仓库
    SHOP: '门店', // 门店
    SUPPLIER: '供应商', // 加工中心
  };
  return map[key] || '企业';
};

const getErrorStatusName = (item: DeptInfoProps): string | undefined => {
  const shopStatusMap = {
    CLOSED: '已关店',
    PENDING: '暂停营业',
  };
  if (item.bizDeptType !== 'SHOP' && item.enabled === false) {
    return '已停用';
  }
  if (item.bizDeptType === 'SHOP') {
    return item.enabled ? shopStatusMap[item.shopStatus || ''] : '已关店';
  }
  return undefined;
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
          const key = getGroupKey(item.bizDeptType);
          const bizDeptTypeName = getGroupNameByKey(key);
          let list: DeptInfoProps[] = [];
          if (groupMap[key]) {
            list = groupMap[key].list;
            list.push(item);
          } else {
            list = [item];
          }
          groupMap[key] = {
            bizDeptTypeName: bizDeptTypeName,
            list: list,
          };
        });
      }
      // 对企业进行排序
      const companyList =
        groupMap['COMPANY'] && Array.isArray(groupMap['COMPANY'].list)
          ? groupMap['COMPANY'].list
          : [];
      if (companyList.length > 1) {
        const sortMap = {
          COMPANY: 1,
          SUPPLY_CHAIN_COMPANY: 2,
          SUPPLY_SUBCOMPANY: 3,
          CHAIN_MANAGE_COMPANY: 4,
        };
        companyList.sort((a, b) => {
          const anum = sortMap[a.bizDeptType];
          const bnum = sortMap[b.bizDeptType];
          return anum - bnum;
        });
      }

      return (
        <>
          {sort.map((key: string) => {
            if (groupMap[key]) {
              return (
                <div key={key} className={`${classPrefix}-item`}>
                  <div className={`${classPrefix}-item-title`}>
                    {groupMap[key].bizDeptTypeName}
                  </div>
                  <div className={`${classPrefix}-item-content`}>
                    {groupMap[key].list.map((item, idx) => {
                      const errorName = getErrorStatusName(item);
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
                            {/*图标*/}
                            <div
                              className={`${classPrefix}-item-child-icon`}
                              style={{ backgroundColor: colorMap[key] }}
                            >
                              <img
                                src={imageMap[key]}
                                className={`${classPrefix}-item-child-image`}
                              ></img>
                            </div>

                            {/*文本*/}
                            <div className={`${classPrefix}-item-child-text`}>
                              {item.bizDeptName}
                            </div>
                            {/** 状态显示 */}
                            {errorName ? (
                              <div
                                className={`${classPrefix}-item-child-status`}
                              >
                                {errorName}
                              </div>
                            ) : (
                              Number(item.todoNumber || 0) > 0 && (
                                <div
                                  className={`${classPrefix}-item-child-badge`}
                                >
                                  {Number(item.todoNumber || 0)}
                                </div>
                              )
                            )}
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>
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
        <div className={`${classPrefix}-view`}>{renderDept()}</div>
      </div>
      {/* </Card> */}
    </NotMenuLayouy>
  );
};

export default SelectDept;
