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
let currentUser: User | null = null
// let currentAppCode = '';
// 应用用户信息
let userAppInfos: Record<string, UserAppInfo> | null = null

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

  let userAppInfosChange = false
  currentUser = user
  if (!userAppInfos) {
    userAppInfos = {}
  }
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
  if (userAppInfosChange) {
    setStorage(AppsUser_Key, userAppInfos)
  }
}

const getAppCode = () => {
  const path = window.location.pathname.replace('//', '/')
  const paths = path.split('/')
  if (paths.length > 1) {
    return paths[1]
  }
  return null
}

const getUser = (): User | null => {
  if (!currentUser) {
    currentUser = getStorage(User_Key)

    if (!userAppInfos) {
      userAppInfos = getStorage<Record<string, UserAppInfo>>(AppsUser_Key)
    }

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
    // console.log(appCode);
    // currentUser
  }
  return currentUser
}

const getAppUser = (sysCode: string) => {
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
  // const req = uesRequest('user', 'chooseSys')
  // getUser()?.userAppInfo = userAppInfo;

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

  // if (cuser.currentSystem.systemCode === user.currentSystem.systemCode) {
  // currentUser = { ...temUser, ...user };
  // setUser(currentUser);
  // }
}
const clearUser = () => {
  localStorage.removeItem(User_Key)
  localStorage.removeItem(AppsUser_Key)
  sessionStorage.removeItem('CG-CURRENT-DICT')
  currentUser = null
  userAppInfos = null
}
export { updateUser, getUser, changeApp, setUser, clearUser }
