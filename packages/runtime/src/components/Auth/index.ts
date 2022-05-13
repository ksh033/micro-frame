import { Modal } from 'antd';
// @ts-ignore
import { history } from 'umi';

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
// 当前的机构
let _bizDeptId: string | null = null;
// 当前用户id
let _userId: string | null = null;
// 定时器
let _timer: any = null;
// 是否显示弹窗
let showWarn: boolean = true;

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
// 重新登录
const setUser = (user: User) => {
  let currentUser: User = user;
  const { currentDept, ...restUser } = currentUser;
  if (currentDept != null) {
    const menus = Array.isArray(currentDept.menus) ? currentDept.menus : [];
    let currentSystem: CurrentSysInfoProps | undefined = void 0;
    if (menus.length > 0) {
      let firstMenu = menus[0];
      if (_userAppCode != null && _userAppCode !== '') {
        const findItem = menus.find((it) => it.pageUrl === _userAppCode);
        if (findItem) {
          firstMenu = findItem;
        }
      }
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
    // 设置当前机构和用户
    _bizDeptId = currentDept.bizDeptId;
    _userId = restUser.userId;
  }
  setStorage(User_Key, restUser);
};
// 切换机构
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
      let firstMenu = menus[0];
      if (_userAppCode != null && _userAppCode !== '') {
        const findItem = menus.find((it) => it.pageUrl === _userAppCode);
        if (findItem) {
          firstMenu = findItem;
        }
      }
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
  // 当前的机构
  _bizDeptId = currentDept.bizDeptId;
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
    // 切换应用时内置bizDeptId
    initInner();

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
  clearInner();
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

const clearInner = () => {
  _bizDeptId = null;
  _userId = null;
};

const clearTimer = () => {
  if (_timer) {
    clearInterval(_timer);
    _timer = null;
  }
};
// 重新内置bizDeptId
const initInner = () => {
  const user = getUser();
  if (user != null && user?.userAppInfo != null) {
    const cacheBizDeptId = user?.userAppInfo.currentDept?.bizDeptId;
    _userId = user.userId;
    _bizDeptId = cacheBizDeptId;
  }
};

const jump = (user: GetUser | null | undefined) => {
  let systemCode = user?.chooseDeptVO.currentSystem?.systemCode;
  if (systemCode) {
    history.push(`/${systemCode}`);
  } else {
    const innermenus = Array.isArray(user?.userAppInfo.currentDept.menus)
      ? user?.userAppInfo.currentDept.menus
      : [];
    if (innermenus && innermenus.length > 0) {
      changeApp(innermenus[0].pageUrl);
      history.push(`/${innermenus[0].pageUrl}`);
    } else {
      history.push(`/`);
    }
  }
};

const initWarnTimer = () => {
  // 清除上次调用
  clearTimer();

  _timer = setInterval(() => {
    const user = getUser();
    if (user != null && user?.userAppInfo != null && showWarn) {
      const cacheBizDeptId = user?.userAppInfo.currentDept?.bizDeptId || null;
      const cacheUserId = user?.userId;
      if (cacheUserId != null && _userId != null && cacheUserId !== _userId) {
        showWarn = false;
        _bizDeptId = cacheBizDeptId;
        Modal.warning({
          title: '提示',
          content: '你已切换到其他账号，需要刷新后才能继续操作。',
          onOk() {
            _userId = cacheUserId;
            jump(user);
            showWarn = true;
          },
        });
        return;
      }
      if (
        cacheBizDeptId != null &&
        _bizDeptId != null &&
        cacheBizDeptId !== _bizDeptId
      ) {
        showWarn = false;
        _bizDeptId = cacheBizDeptId;
        Modal.warning({
          title: '提示',
          content: '你已切换到其他机构，需要刷新后才能继续操作。',
          onOk() {
            jump(user);
            showWarn = true;
          },
        });
      }
    }
  }, 3000);
};

export {
  clearUser,
  clearTimer,
  setUser,
  changeApp,
  getUser,
  getAppCode,
  openWindow,
  setUserAppCode,
  updateCurrentDept,
  getUserAppCode,
  initWarnTimer,
  initInner,
};
