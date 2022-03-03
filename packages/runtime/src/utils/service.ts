import { request, useRequest as umiUesRequest } from "./request";
interface MethodProps {
  url: string;
  method: "get" | "post";
  sysCode: string;
}
// @ts-ignore
import services from "@@service";
// '/api/anony/sys/list': { methodName: 'getApplist', method: 'GET' },

// services { ...services.system, ...services.user };
// function getService<T extends keyof typeof services>(syscode:T):any

const AllReq = {};
const createRequest = (methodService: MethodProps, funName: string) => {
  const { method, url, sysCode } = methodService;

  const requestService = (params?: any, options?: any): Promise<any> => {
    const reqUrl = `${url}`;
    const reqOpts = { ...options };
    if (method.toLocaleLowerCase() === "get") {
      reqOpts["params"] = params;
    } else if (method.toLocaleLowerCase() === "post") {
      reqOpts["data"] = params;
    } else {
      reqOpts["body"] = params;
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
>(mcode: T, ...funName: P[]): Record<P,  (params?: any, options?: any) => Promise<any>>;
export function getService<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T, ...funName: P[]): any {
  let mservices = {};
  if (funName && funName.length > 0) {
    funName.forEach((item) => {
      const serviceItem: any = services[mcode][item];
      const itemReq = createRequest(serviceItem, `${item}`);
      mservices = { ...mservices, ...itemReq };
    });
    return mservices;
  } else {
    const serviceItems = services[mcode];

    Object.keys(serviceItems).forEach((key) => {
      const item = services[mcode][key];
      const itemReq = createRequest(item, `${key}`);
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
  let serviceApi = getServiceApi(mcode, funName);
  return umiUesRequest((params) => {
    return serviceApi(params, useOptions);
  }, useOptions);
}

export { uesRequest, services, getServiceApi };
