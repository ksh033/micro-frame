import React from 'react'
import { getUser,updateCurrentDept } from '../Auth'
import { uesRequest } from '../../utils/api'
// @ts-ignore
import { history } from 'umi'
import './index.less'
import { message } from 'antd'

const SelectDept: React.FC<any> = (props) => {
  const user = getUser()
  const { run } = uesRequest('user', 'chooseDept')
  const selectOrg = async (deptId: any) => {
    let data = await run({ deptId })
    // let data:any = null
    // const depList = user?.deptList
    // if(Array.isArray(depList) && depList.length > 0) {
    //   const deptInfo = depList.find(it=>it.bizDeptId === deptId);
    //   if(deptInfo){
    //     data = {
    //       currentDept:deptInfo
    //     }
    //   }
    // }
    if(data){
      const userAppInfos = updateCurrentDept(data)
      if (userAppInfos.currentSystem?.systemCode) {
        history.push(`/${userAppInfos.currentSystem.systemCode}`)
      }else {
        history.push("/")
      }
    }else {
      message.warn("找不到该组织")
    }
    
  }

  const renderDept = () => {
    if (user&&user.deptList) {
      const depList = user.deptList
      const currentDept=user.chooseDeptVO?.currentDept
      const itemsList = depList.map((val) => {
        const { bizDeptId, bizDeptName } = val
        let className="org-list-item"
        if (currentDept?.bizDeptId===bizDeptId){
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
            <div className="inner-content">{itemsList}</div>
            
          </div>
        </div>
      )
    }
    return <div className="inner-wrapper"></div>
  }

  return (
    <div className="select-wrapper">{renderDept()}</div>
  )
}

export default SelectDept
