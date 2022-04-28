export interface DeptInfoProps {
  bizDeptId: string;
  bizDeptName: string;
  bizDeptType: string;
  bizDeptTypeName: string;
  bizDeptCode: string;
  contactName: string;
  contactPhone: string;
}

export interface CurrentDeptInfoProps extends DeptInfoProps {
  menus: any[];
  companyDept: any;
  companyId: string;
  companyName: string;
  staffId: string;
}

export interface CurrentSysInfoProps {
  systemCode: string;
  systemName: string;
  menus: any[];
}

export interface CurrentDeptProps {
  currentDept: CurrentDeptInfoProps;
  currentSystem?: CurrentSysInfoProps;
}

export interface User {
  currentDept?: CurrentDeptInfoProps;
  email: string; // 邮箱地址
  lastLoginTime: string; // 最后一次登陆时间
  needModifyPwd: boolean; // 是否需要修改密码
  optionalDepts: DeptInfoProps[];
  phone: string; // 手机号
  realName: string; // 用户昵称
  userId: string;
  userName: string;
  token: string; // token
  wechatAvatarUrl: string | null; // 微信头像信息
  wechatNickname: string | null; // 微信头像昵称
  wechatUnionId: string | null; // 微信id
}

export interface GetUser extends User {
  chooseDeptVO: CurrentDeptProps;
  userAppInfo: CurrentDeptProps;
}

// type User =  BaseUser & {};

const User_Key = 'CG-CURRENT-USER';

const AppsUser_Key = 'APP-CURRENT-USERS';
// 当前用户appCode
let _userAppCode = '';

const setStorage = (skey: string, value: any) => {
  localStorage.setItem(skey, JSON.stringify(value));
};
const getStorage = <T>(skey: string): T | null => {
  const valueStr = localStorage.getItem(skey);
  if (valueStr) {
    const v: T = JSON.parse(valueStr);
    return v;
  }
  return null;
};

const setUser = (user: User) => {
  let currentUser: User = user;
  const { currentDept, ...restUser } = currentUser;
  if (currentDept != null) {
    const menus = Array.isArray(currentDept.menus) ? currentDept.menus : [];
    let currentSystem: CurrentSysInfoProps | undefined = void 0;
    if (menus.length > 0) {
      const firstMenu = menus[0];
      currentSystem = {
        systemCode: firstMenu.pageUrl,
        systemName: firstMenu.name,
        menus: firstMenu.children,
      };
    }
    if (currentDept.companyDept) {
      currentDept.companyId = currentDept.companyDept.bizDeptId || '';
      currentDept.companyName = currentDept.companyDept.bizDeptName || '';
    }

    setStorage(AppsUser_Key, {
      currentDept: currentDept,
      currentSystem: currentSystem,
    });
  }
  setStorage(User_Key, restUser);
};

const updateCurrentDept = (currentDeptVo: CurrentDeptInfoProps) => {
  const currentDept: CurrentDeptInfoProps = currentDeptVo;
  let currentSystem: CurrentSysInfoProps | undefined = void 0;
  if (currentDeptVo) {
    if (currentDeptVo.companyDept) {
      currentDept.companyId = currentDeptVo.companyDept.bizDeptId || '';
      currentDept.companyName = currentDeptVo.companyDept.bizDeptName || '';
    }
    const menus = Array.isArray(currentDeptVo.menus) ? currentDeptVo.menus : [];
    if (menus.length > 0) {
      const firstMenu = menus[0];
      currentSystem = {
        systemCode: firstMenu.pageUrl,
        systemName: firstMenu.name,
        menus: firstMenu.children,
      };
    }
    setStorage(AppsUser_Key, {
      currentSystem: currentSystem,
      currentDept: currentDept,
    });
  }
  return {
    currentSystem: currentSystem,
    currentDept: currentDept,
  };
};

/**
 * 切换应用
 *
 * @param sysCode
 */
const changeApp = (sysCode: string) => {
  const userAppInfos = getStorage<CurrentDeptProps>(AppsUser_Key);
  if (
    userAppInfos?.currentDept &&
    Array.isArray(userAppInfos.currentDept.menus)
  ) {
    const index = userAppInfos.currentDept.menus.findIndex(
      (it) => it.pageUrl === sysCode
    );
    if (index > -1) {
      const itemMuen = userAppInfos.currentDept.menus[index];
      userAppInfos.currentSystem = {
        systemCode: itemMuen.pageUrl,
        systemName: itemMuen.name,
        menus: itemMuen.children,
      };
      setStorage(AppsUser_Key, userAppInfos);
      setUserAppCode(sysCode);
      return true;
    } else {
      userAppInfos.currentSystem = undefined;
      setStorage(AppsUser_Key, userAppInfos);
      setUserAppCode(sysCode);
      return false;
    }
  }
  return false;
};

const getUser = (): GetUser | null | undefined => {
  const currentUser: any = getStorage(User_Key);
  const tuserApp = getStorage<CurrentDeptProps>(AppsUser_Key);

  if (tuserApp) {
    currentUser.chooseDeptVO = tuserApp;
    currentUser.userAppInfo = tuserApp;
  }

  return currentUser;
};

const clearUser = () => {
  localStorage.removeItem(User_Key);
  localStorage.removeItem(AppsUser_Key);
  sessionStorage.removeItem('CG-CURRENT-DICT');
  sessionStorage.removeItem('CG-WEIGHT-UNIT');
};

const getAppCode = () => {
  const userAppInfos = getStorage<CurrentDeptProps>(AppsUser_Key);
  if (userAppInfos?.currentSystem?.systemCode) {
    return userAppInfos?.currentSystem.systemCode;
  }
  return 'common';
};

const openWindow = (url: string) => {
  window.open(url);
};

const setUserAppCode = (userAppCode) => {
  _userAppCode = userAppCode;
};

const getUserAppCode = () => {
  return getAppCode();
};

export {
  clearUser,
  setUser,
  changeApp,
  getUser,
  getAppCode,
  openWindow,
  setUserAppCode,
  updateCurrentDept,
  getUserAppCode,
};
