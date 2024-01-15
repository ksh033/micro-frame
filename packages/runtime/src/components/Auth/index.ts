import { message, Modal } from "antd";
// @ts-ignore
import { history } from "umi";

/** "COMPANY" 集团 | "CHAIN_MANAGE_COMPANY" 连锁公司| "SHOP" 门店 */
export type DeptType =
  | "COMPANY"
  | "CHAIN_MANAGE_COMPANY"
  | "SHOP"
  | "WAREHOUSE"
  | "SUPPLY_CHAIN_COMPANY"
  | "SUPPLY_SUBCOMPANY"
  | "STATION ";
/** 门店状态 OPEN营业中、CLOSED已关店、PENDING暂停营业 */
export type ShopStatus = "OPEN" | "CLOSED" | "PENDING";
export interface DeptInfoProps {
  /** 机构id */
  bizDeptId: string;
  /** 机构名称 */
  bizDeptName: string;
  /** "COMPANY" 集团 | "CHAIN_MANAGE_COMPANY" 连锁公司| "SHOP" 门店 */
  bizDeptType: DeptType;
  /** 组织机构名称 */
  bizDeptTypeName: string;
  /** 组织机构编码 */
  bizDeptCode: string;
  /** 机构联系人 */
  contactName: string;
  /** 机构联系电话 */
  contactPhone: string;
  /** 待办事项条数 */
  todoNumber?: number;
  /** 是否启用 */
  enabled?: boolean;
  /** 门店状态：OPEN营业中、CLOSED已关店、PENDING暂停营业 */
  shopStatus?: ShopStatus;
}

export interface CurrentDeptInfoProps extends DeptInfoProps {
  menus: any[];
  companyDept: any;
  companyId: string;
  companyName: string;
  staffId: string;
  useLocation?: boolean; // 是否分区
  enabled?: boolean;
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
  /** 邮箱地址 */
  email: string;
  /** 最后一次登陆时间 */
  lastLoginTime: string; //
  /** 是否需要修改密码 */
  needModifyPwd: boolean;
  optionalDepts: DeptInfoProps[];
  phone: string; // 手机号
  realName: string; // 用户昵称
  userId: string;
  userName: string;
  token: string; // token
  /** 微信头像信息 */
  wechatAvatarUrl: string | null; // 微信头像信息
  /** 微信头像昵称 */
  wechatNickname: string | null; // 微信头像昵称
  /** 微信id */
  wechatUnionId: string | null; // 微信id
}

export interface GetUser extends User {
  chooseDeptVO: CurrentDeptProps;
  userAppInfo: CurrentDeptProps;
}

// type User =  BaseUser & {};

const User_Key = "CG-CURRENT-USER";

const AppsUser_Key = "APP-CURRENT-USERS";
// 当前用户appCode
let _userAppCode = "";
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
      if (_userAppCode != null && _userAppCode !== "") {
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
      currentDept.companyId = currentDept.companyDept.bizDeptId || "";
      currentDept.companyName = currentDept.companyDept.bizDeptName || "";
    }

    setStorage(AppsUser_Key, {
      currentDept: currentDept,
      currentSystem: currentSystem,
    });
    setUserAppCode(currentSystem?.systemCode || "");
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
      currentDept.companyId = currentDeptVo.companyDept.bizDeptId || "";
      currentDept.companyName = currentDeptVo.companyDept.bizDeptName || "";
    }
    const menus = Array.isArray(currentDeptVo.menus) ? currentDeptVo.menus : [];
    if (menus.length > 0) {
      let firstMenu = menus[0];
      if (_userAppCode != null && _userAppCode !== "") {
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
  setUserAppCode(currentSystem?.systemCode || "");
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
  if (currentUser) {
    const tuserApp = getStorage<CurrentDeptProps>(AppsUser_Key);

    if (tuserApp) {
      currentUser.chooseDeptVO = tuserApp;
      currentUser.userAppInfo = tuserApp;
    }
  }


  return currentUser;
};

/**
 * @description: 获取当前登录组织机构信息
 * @returns {any}
 */
const getBizDeptInfo = () => {
  const user = getUser();
  if (user != null && user?.userAppInfo != null) {
    const { bizDeptId, bizDeptName, bizDeptType } =
      user?.userAppInfo.currentDept;
    return {
      bizDeptId,
      bizDeptName,
      bizDeptType,
    };
  }
  return null;
};
const clearUser = () => {
  localStorage.removeItem(User_Key);
  localStorage.removeItem(AppsUser_Key);
  sessionStorage.removeItem("CG-CURRENT-DICT");
  sessionStorage.removeItem("CG-WEIGHT-UNIT");
  sessionStorage.removeItem("CG-LOCATIONAREA");
  clearInner();
};

const getAppCode = () => {
  const userAppInfos = getStorage<CurrentDeptProps>(AppsUser_Key);
  if (userAppInfos?.currentSystem?.systemCode) {
    return userAppInfos?.currentSystem.systemCode;
  }
  return "common";
};

const openWindow = (
  url?: string | URL | undefined,
  target?: string | undefined,
  features?: string | undefined
) => {
  window.open(url, target, features);
};

const setUserAppCode = (userAppCode) => {
  _userAppCode = userAppCode;
};

const getUserAppCode = () => {
  return _userAppCode;
};

const clearInner = () => {
  _bizDeptId = null;
  _userId = null;
  _userAppCode = "";
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
    let systemCode = user?.userAppInfo?.currentSystem?.systemCode || "";
    if (systemCode == null || systemCode === "") {
      const menus = Array.isArray(user?.chooseDeptVO?.currentDept.menus)
        ? user?.chooseDeptVO?.currentDept.menus
        : [];
      if (Array.isArray(menus) && menus.length > 0) {
        systemCode = menus[0].pageUrl;
      }
    }
    _userId = user.userId;
    _bizDeptId = cacheBizDeptId;
    _userAppCode = systemCode;
  }
};

const jump = (user: GetUser | null | undefined) => {
  let systemCode = user?.chooseDeptVO.currentSystem?.systemCode;
  if (systemCode) {
    history.push(`/${systemCode}`);
    window.location.reload();
  } else {
    const innermenus = Array.isArray(user?.userAppInfo.currentDept.menus)
      ? user?.userAppInfo.currentDept.menus
      : [];
    if (innermenus && innermenus.length > 0) {
      changeApp(innermenus[0].pageUrl);
      history.push(`/${innermenus[0].pageUrl}`);
      window.location.reload();
    } else {
      window.location.reload();
    }
  }
};

const warnCommit = () => {
  const user = getUser();
  const cacheBizDeptId = user?.userAppInfo.currentDept?.bizDeptId || null;
  let systemCode = user?.userAppInfo?.currentSystem?.systemCode || "";
  if (systemCode == null || systemCode === "") {
    const menus = Array.isArray(user?.chooseDeptVO?.currentDept.menus)
      ? user?.chooseDeptVO?.currentDept.menus
      : [];
    if (Array.isArray(menus) && menus.length > 0) {
      systemCode = menus[0].pageUrl;
    }
  }
  const cacheUserId = user?.userId || null;
  _userId = cacheUserId;
  _bizDeptId = cacheBizDeptId;
  _userAppCode = systemCode;
  jump(user);
  showWarn = true;
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
          title: "提示",
          content: "你已切换到其他账号，需要刷新后才能继续操作。",
          onOk() {
            warnCommit();
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
        Modal.warning({
          title: "提示",
          content: "你已切换到其他机构，需要刷新后才能继续操作。",
          onOk() {
            warnCommit();
          },
        });
      }
    }
  }, 3000);
};

const getDeptEnabled = (warnstr: string = "该仓库已被禁用，无法创建") => {
  const user = getUser();
  const bizDeptType = user?.userAppInfo.currentDept?.bizDeptType;
  const enabled = user?.userAppInfo.currentDept?.enabled;
  if (bizDeptType === "WAREHOUSE" && enabled === false) {
    message.warning(warnstr);
    return false;
  }

  return true;
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
  getDeptEnabled,
  getBizDeptInfo,
};
