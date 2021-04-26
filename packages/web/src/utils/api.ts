import { request, useRequest as umiUesRequest } from "@micro-frame/sc-runtime";

interface MethodProps {
  url: string;
  method: "get" | "post";
  sysCode: string;
}

// '/api/anony/sys/list': { methodName: 'getApplist', method: 'GET' },
const services = {
  // 模块
  system: {
    getApplist: {
      url: "/user/api/anony/sys/list",
      method: "get",
      sysCode: "common",
    },
  },
  user: {
    loginByPhone: {
      url: "/user/api/anony/user/login/dev",
      method: "get",
      sysCode: "common",
    },
    chooseDept: {
      url: "/user/api/dept/choose",
      method: "get",
      sysCode: "common",
    },
    chooseSys: {
      url: "/user/api/sys/choose",
      method: "get",
      sysCode: "common",
    },
  },
  deptUser: {
    /** 用户机构服务接口 */

      /** 新增或更换管理员--已完成 */
      set: { url: "/user/api/adminUser/set", method: "post", sysCode: "user" },

      /** 查询当前登陆用户信息--已完成 */
      detail: {
        url: "/user/api/currentUser/detail",
        method: "get",
        sysCode: "user",
      },

      /** 修改当前用户信息用户(响应userId)--已完成 */
      updateCurrentUser: {
        url: "/user/api/currentUser/update",
        method: "post",
        sysCode: "user",
      },

      /** 查询用户管理机构下拉列表（角色管理）--已完成 */
      listRoleDept: {
        url: "/user/api/deptRole/listDept",
        method: "get",
        sysCode: "user",
      },

      /** 查询用户管理机构下拉列表（用户管理）--已完成 */
      listUserDept: {
        url: "/user/api/deptUser/listDept",
        method: "get",
        sysCode: "user",
      },

      /** 新增用户(响应userId)--已完成 */
      formSubmit: { url: "/user/api/user/add", method: "post", sysCode: "user" },

      /** 删除用户(响应userId)--已完成 */
      delete: { url: "/user/api/user/delete", method: "post", sysCode: "user" },

      /** 启用禁用用户(响应userId)--已完成 */
      enable: { url: "/user/api/user/enable", method: "post", sysCode: "user" },

      /** 根据用户id查询用户--已完成 */
      getUserById: {
        url: "/user/api/user/getUserById",
        method: "post",
        sysCode: "user",
      },

      /** 分页-查询用户--已完成 */
      queryPage: {
        url: "/user/api/user/queryPage",
        method: "post",
        sysCode: "user",
      },

      /** 修改用户(响应userId)--已完成 */
      update: { url: "/user/api/user/update", method: "post", sysCode: "user" },
  
  },
  "role":{
    listDeptRole: { url: "/user/api/role/listDeptRole", method: "get", sysCode: "user" }
    
  }
};

// services { ...services.system, ...services.user };
// function getService<T extends keyof typeof services>(syscode:T):any

const AllReq = {};
const createRequest = (methodService: MethodProps, funName: string) => {
  const { method, url, sysCode } = methodService;

  const requestService = (params?: any, options?: any): Promise<any> => {
    const reqUrl = `${url}`;
    const reqOpts = { ...options, headers: { sys_code: sysCode } };
    if (method === "get") {
      reqOpts["params"] = params;
    } else {
      reqOpts["data"] = params;
    }
    reqOpts["method"] = method;
    return request(reqUrl, reqOpts);
  };
  const req = {};
  if (AllReq[url]) {
    req[funName] = AllReq[url];
  } else {
    req[funName] = requestService;
  }

  return req;
};
export function getService<T extends keyof typeof services>(mcode: T): any;

export function getService<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T,...funName:P[]): any;
export function getService<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T, ...funName: P[]): any {
  let mservices = {};
  if (funName) {
    funName.forEach(item=>{
      const serviceItem: any = services[mcode][item];
      const itemReq=createRequest(serviceItem, `${funName}`);
      mservices = { ...mservices, ...itemReq };
    })
    return mservices;
  } else {
    const serviceItems = services[mcode];
   
    Object.keys(serviceItems).forEach((key) => {
      const item = services[mcode][key];
      const itemReq = createRequest(item, `${funName}`);
      mservices = { ...mservices, ...itemReq };
    });
    return mservices;
  }
}
//getService("user","chooseDept","chooseSys")
function getServiceApi<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T, funName: P): (params?: any, options?: any) => Promise<any> {
  const serviceItem = getService(mcode, funName);
  //const itemReq = createRequest(`${apiUrl}`, urlItem);
  return serviceItem[funName];
}
function uesRequest<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T, funName: P, options?: any) {
  const useOptions = { ...options };
  return umiUesRequest(getServiceApi(mcode, funName), useOptions);
}

export { uesRequest, services, getServiceApi };
