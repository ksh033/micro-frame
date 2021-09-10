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
  const userAppInfos =
    getStorage<Record<string, UserAppInfo>>(AppsUser_Key) || {}
  let userAppInfosChange = false

  let currentUser: User = user

  const systemCode = currentUser.userAppInfo?.currentSystem.systemCode || ''
  userAppInfos[systemCode] = user.userAppInfo
  userAppInfosChange = true

  const { userAppInfo, ...restUser } = currentUser

  setStorage(User_Key, restUser)
  setStorage(CurrentApp_KEY, systemCode)
  //@ts-ignore
  window.syscode = systemCode
  if (userAppInfosChange) {
    setStorage(AppsUser_Key, userAppInfos)
  }
}

const getAppCode = () => {
  // @ts-ignore
  let appcode = window.syscode

  if (appcode === undefined || appcode === null) {
    const pathname = window.location.pathname
    if (pathname === '/') {
      appcode = getStorage<string>(CurrentApp_KEY)
      return appcode
    } else {
      const paths = pathname.substring(1, pathname.length).split('/')
      const userAppInfos = getStorage<Record<string, UserAppInfo>>(AppsUser_Key)
      if (userAppInfos && paths[0] && userAppInfos[paths[0]]) {
        return paths[0]
      } else {
        appcode = getStorage<string>(CurrentApp_KEY)
        return appcode
      }
    }
  }

  return appcode
}

const getUser = (): User | null | undefined => {
  const currentUser: any = getStorage(User_Key)
  const userAppInfos = getStorage<Record<string, UserAppInfo>>(AppsUser_Key)

  const appCode = getAppCode()
  if (appCode && userAppInfos && currentUser) {
    const tuserApp = userAppInfos[appCode]
    if (tuserApp) {
      currentUser.userAppInfo = tuserApp
    }
  }
  return currentUser
}

const getAppUser = () => {
  const appCode = getAppCode()
  const userAppInfos = getStorage<Record<string, UserAppInfo>>(AppsUser_Key)
  if (userAppInfos) {
    return userAppInfos[appCode]
  }
  return null
}

/**
 * 切换应用
 *
 * @param sysCode
 */
const changeApp = (sysCode: string, userAppInfo?: UserAppInfo) => {
  const userAppInfos = getStorage<Record<string, UserAppInfo>>(AppsUser_Key)

  if (userAppInfos && userAppInfo) {
    userAppInfos[sysCode] = userAppInfo
    //@ts-ignore
    window.syscode = sysCode
    setStorage(AppsUser_Key, userAppInfos)
    setStorage(CurrentApp_KEY, sysCode)
    return true
  }
  return false
}
const updateUser = (userAppInfo: UserAppInfo) => {
  const appCode = getAppCode()
  const userAppInfos = getStorage<Record<string, UserAppInfo>>(AppsUser_Key)

  if (userAppInfos) {
    const ruserAppInfo = userAppInfos[appCode]
    ruserAppInfo.currentDept = userAppInfo.currentDept
    ruserAppInfo.menuTreeNodeList = userAppInfo.menuTreeNodeList

    userAppInfos[appCode] = ruserAppInfo
  }
  if (userAppInfos) {
    setStorage(AppsUser_Key, userAppInfos)
  }
}
const clearUser = () => {
  localStorage.removeItem(User_Key)
  localStorage.removeItem(AppsUser_Key)
  localStorage.removeItem(CurrentApp_KEY)
  sessionStorage.removeItem('CG-CURRENT-DICT')
}
export { updateUser, getUser, changeApp, setUser, clearUser, getAppCode }
