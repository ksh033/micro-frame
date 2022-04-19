import _ from 'lodash'

interface DeptInfoProps {
  bizDeptId: string
  bizDeptName: string
  bizDeptType: string
  contactName: string
  contactPhone: string
  subcompanyId: string
  subcompanyName: string
  systemList: SysInfoProps[]
}

interface SysInfoProps {
  systemCode: string
  systemName: string
  defaulted: boolean
  enabled: boolean
  publiced: string
  menuTreeNodeList: any[]
}

export interface CurrentDeptProps {
  currentDept: DeptInfoProps
  currentSystem?: SysInfoProps
}

export interface User {
  chooseDeptVO?: null | CurrentDeptProps
  deptList: DeptInfoProps[]
  lastLoginTime: string // 最后一次登陆时间
  realName: string // 用户昵称
  needModifyPwd: boolean // 是否需要修改密码
  token: string // token
  phone: string // 手机号
  userName: string
  email: string // 邮箱地址
  superAdminFlag: boolean // 是否是超级管理员
  wechatAvatarUrl: string | null // 微信头像信息
  wechatNickname: string | null // 微信头像昵称
  wechatUnionId: string | null // 微信id
}

// type User =  BaseUser & {};

const User_Key = 'CG-CURRENT-USER'

const AppsUser_Key = 'APP-CURRENT-USERS'
// 当前用户appCode
let _userAppCode = ''

const setStorage = (skey: string, value: any) => {
  localStorage.setItem(skey, JSON.stringify(value))
}
const getStorage = <T>(skey: string): T | null => {
  const valueStr = localStorage.getItem(skey)
  if (valueStr) {
    const v: T = JSON.parse(valueStr)
    return v
  }
  return null
}

const setUser = (user: User) => {
  let currentUser: User = user
  const { chooseDeptVO, ...restUser } = currentUser
  if(chooseDeptVO!=null){
    setStorage(AppsUser_Key, chooseDeptVO)
  }
  setStorage(User_Key, restUser)
}
const updateCurrentDept = (userAppInfos: CurrentDeptProps) => {
  if (userAppInfos) {
    if(userAppInfos.currentSystem == null){
      if(Array.isArray( userAppInfos.currentDept.systemList) &&  userAppInfos.currentDept.systemList.length > 0){
        if (!_userAppCode) {
          userAppInfos.currentSystem = userAppInfos.currentDept.systemList[0];
          setStorage(AppsUser_Key, userAppInfos)
        }else {
          if (userAppInfos?.currentDept && Array.isArray(userAppInfos.currentDept.systemList)) {
            const index = userAppInfos.currentDept.systemList.findIndex(it=>it.systemCode === _userAppCode)
            if(index > -1){
              userAppInfos.currentSystem = userAppInfos.currentDept.systemList[index];
              setStorage(AppsUser_Key, userAppInfos)
            }else {
              userAppInfos.currentSystem = undefined
              setStorage(AppsUser_Key, userAppInfos)
            }
          }
        }
      }  
    }
    
  }
  return userAppInfos
}

/**
 * 切换应用
 *
 * @param sysCode
 */
 const changeApp = (sysCode: string) => {
  const userAppInfos = getStorage<CurrentDeptProps>(AppsUser_Key)
  if (userAppInfos?.currentDept && Array.isArray(userAppInfos.currentDept.systemList)) {
    const index = userAppInfos.currentDept.systemList.findIndex(it=>it.systemCode === sysCode)
    if(index > -1){
      userAppInfos.currentSystem = userAppInfos.currentDept.systemList[index];
      setStorage(AppsUser_Key, userAppInfos)
      setUserAppCode(sysCode)
      return true
    }else {
      userAppInfos.currentSystem = undefined
      setStorage(AppsUser_Key, userAppInfos)
      setUserAppCode(sysCode)
      return false
    }
   
  }
  return false
}

const getUser = (): User & {
  userAppInfo: CurrentDeptProps
} | null | undefined => {
  const currentUser: any = getStorage(User_Key)
  const tuserApp = getStorage<CurrentDeptProps>(AppsUser_Key)

  if (tuserApp) {
    currentUser.chooseDeptVO = tuserApp
    currentUser.userAppInfo = tuserApp
  }

  return currentUser
}

const clearUser = () => {
  localStorage.removeItem(User_Key)
  localStorage.removeItem(AppsUser_Key)
  sessionStorage.removeItem('CG-CURRENT-DICT')
  sessionStorage.removeItem('CG-WEIGHT-UNIT')
}

const getAppCode = () => {
  const userAppInfos = getStorage<CurrentDeptProps>(AppsUser_Key)
  if(userAppInfos?.currentSystem?.systemCode){
    return userAppInfos?.currentSystem.systemCode
  }
  return 'common'
}

const openWindow = (url: string) => {
  // restUserAppCode(getUserAppCode())
  window.open(url)
}


const setUserAppCode = (userAppCode) => {
  _userAppCode = userAppCode
}

export {
  clearUser,
  setUser,
  changeApp,
  getUser,
  getAppCode,
  openWindow,
  setUserAppCode,
  updateCurrentDept
}
