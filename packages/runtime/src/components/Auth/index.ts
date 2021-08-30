import _ from 'lodash'

interface DeptInfoProps {
  bizDeptId: string
  bizDeptName: string
  bizDeptType: string
  contactName: string
  contactPhone: string
}

interface SysInfoProps {
  systemCode: string
  systemName: string
  defaulted: boolean
  enabled: boolean
  publiced: string
}

export interface UserAppInfo {
  currentSystem: SysInfoProps
  currentDept: DeptInfoProps
  deptList: DeptInfoProps[]
  needChooseDept: boolean
  menuTreeNodeList: any[]
}
export interface User {
  systemList: SysInfoProps[]
  lastLoginTime: string // 最后一次登陆时间
  realName: string // 用户昵称
  needModifyPwd: boolean // 是否需要修改密码
  token: string // token
  phone: string // 手机号
  userName: string
  userAppInfo: UserAppInfo
  email: string // 邮箱地址
  superAdminFlag: boolean // 是否是超级管理员
}

// type User =  BaseUser & {};

const User_Key = 'CG-CURRENT-USER'

const AppsUser_Key = 'APP-CURRENT-USERS'

const CurrentApp_KEY = 'CURRENT-APP'

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
  // let currentUser = null;
  let userAppInfos = {}
  let userAppInfosChange = false

  let currentUser = user
  if (!userAppInfos[currentUser.userAppInfo.currentSystem.systemCode]) {
    userAppInfos[currentUser.userAppInfo.currentSystem.systemCode] =
      user.userAppInfo
    userAppInfosChange = true
  } else {
    const tuser = userAppInfos[currentUser.userAppInfo.currentSystem.systemCode]

    if (!_.eq(tuser.currentDept, user.userAppInfo.currentDept)) {
      userAppInfos[currentUser.userAppInfo.currentSystem.systemCode] =
        user.userAppInfo
      userAppInfosChange = true
    }
  }
  setStorage(User_Key, currentUser)
  setStorage(CurrentApp_KEY, currentUser.userAppInfo.currentSystem.systemCode)

  if (userAppInfosChange) {
    setStorage(AppsUser_Key, userAppInfos)
  }
}

const getAppCode = () => {
  return getStorage<string>(CurrentApp_KEY)
}

const getUser = (): User | null | undefined => {
  const currentUser: any = getStorage(User_Key)

  const userAppInfos = getStorage<Record<string, UserAppInfo>>(AppsUser_Key)

  const appCode = getAppCode()
  if (appCode && userAppInfos && currentUser) {
    const tuserApp = userAppInfos[appCode]
    if (tuserApp) {
      if (
        tuserApp.currentSystem.systemCode !==
        currentUser.userAppInfo.currentSystem.systemCode
      ) {
        currentUser.userAppInfo = tuserApp
        setUser(currentUser)
      }
    }
  }
  return currentUser
}

const getAppUser = (sysCode: string) => {
  const userAppInfos = getStorage<Record<string, UserAppInfo>>(AppsUser_Key)
  if (userAppInfos) {
    return userAppInfos[sysCode]
  }
  return null
}

/**
 * 切换应用
 *
 * @param sysCode
 */
const changeApp = (sysCode: string, userAppInfo?: UserAppInfo) => {
  const currentUser: any = getStorage(User_Key)
  const userAppInfos = getStorage<Record<string, UserAppInfo>>(AppsUser_Key)
  if (userAppInfos && userAppInfos[sysCode]) {
    if (currentUser) {
      currentUser.userAppInfo = userAppInfos[sysCode]
      setUser(currentUser)
      return true
    }
  }
  if (userAppInfo) {
    if (currentUser) {
      currentUser.userAppInfo = userAppInfo
      setUser(currentUser)
    }
    return true
  }

  return false
}
const updateUser = (userAppInfo: UserAppInfo) => {
  const cuser = getUser()
  if (cuser) {
    cuser.userAppInfo.currentDept = userAppInfo.currentDept
    cuser.userAppInfo.menuTreeNodeList = userAppInfo.menuTreeNodeList
    setUser(cuser)
  }
}
const clearUser = () => {
  localStorage.removeItem(User_Key)
  localStorage.removeItem(AppsUser_Key)
  localStorage.removeItem(CurrentApp_KEY)
  sessionStorage.removeItem('CG-CURRENT-DICT')
}
export { updateUser, getUser, changeApp, setUser, clearUser, getAppCode }
