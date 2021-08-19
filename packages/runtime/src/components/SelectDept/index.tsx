import React from 'react'
import { PageContainer } from '@scboson/sc-layout'
import { getUser, updateUser } from '../Auth'

import { uesRequest } from '../../utils/api'
// @ts-ignore
import { history } from 'umi'
import './index.less'

const SelectDept: React.FC<any> = (props) => {
  const user = getUser()
  const { run } = uesRequest('user', 'chooseDept')
  const selectOrg = async (deptId: any) => {
    if (user) {
      const currentSys = user.userAppInfo.currentSystem
      const data = await run({ deptId, systemCode: currentSys.systemCode })
      updateUser(data)
      history.push(`/${currentSys.systemCode}`)
    }
  }

  const renderDept = () => {
    if (user) {
      const depList = user.userAppInfo.deptList
      const currentDept=user.userAppInfo.currentDept||{}
      const itemsList = depList.map((val) => {
        const { bizDeptId, bizDeptName } = val
        let className="org-list-item"
        if (currentDept.bizDeptId===bizDeptId){
          className="org-list-item action"
        }
        return (
          <div
            className={className}
            key={bizDeptId}
            title={bizDeptName}
            onClick={() => {
              selectOrg(bizDeptId)
            }}
          >
            <div className="name">{bizDeptName}</div>
            <div className="desc-item">机构类型:</div>
          </div>
        )
      })
      return (
        <div className="inner-wrapper">
          <div>
            <div className="inner-title">机构列表</div>
            {itemsList}
          </div>
        </div>
      )
    }
    return <div className="inner-wrapper"></div>
  }

  return (
    <PageContainer title="选择机构">
      <div className="select-wrapper">{renderDept()}</div>
    </PageContainer>
  )
}

export default SelectDept
