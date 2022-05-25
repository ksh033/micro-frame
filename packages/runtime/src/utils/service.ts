// @ts-ignore
import {
  request,
  useRequest as umiUesRequest,
  CustomRequestOptionsInit,
  BaseOptions,
} from './request';
interface MethodProps {
  url: string;
  method: 'get' | 'post';
}
// @ts-ignore
import services from '@@service';

export type ServiceKeyTypes = keyof typeof services;

const AllReq = {};
const createRequest = (methodService: MethodProps, funName: string) => {
  const { method, url } = methodService;

  const requestService = (params?: any, options?: any): Promise<any> => {
    const reqUrl = `${url}`;
    const reqOpts = { ...options };
    if (method.toLocaleLowerCase() === 'get') {
      reqOpts['params'] = params;
    } else if (method.toLocaleLowerCase() === 'post') {
      reqOpts['data'] = params;
    } else {
      reqOpts['body'] = params;
    }
    reqOpts['method'] = method;
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
export function getService<T extends ServiceKeyTypes>(
  mcode: T
): {
  [P in keyof typeof services[T]]: (
    params?: any,
    options?: CustomRequestOptionsInit
  ) => Promise<any>;
};

export function getService<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(
  mcode: T,
  ...funName: P[]
): Record<
  P,
  (params?: any, options?: CustomRequestOptionsInit) => Promise<any>
>;
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
function getServiceApi<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(
  mcode: T,
  funName: P
): (params?: any, options?: CustomRequestOptionsInit) => Promise<any> {
  const serviceItem = getService(mcode, funName);
  //const itemReq = createRequest(`${apiUrl}`, urlItem);
  return serviceItem[funName];
}

function uesRequest<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(
  mcode: T,
  funName: P,
  useOpts?: BaseOptions<any, any>,
  reqOpts?: CustomRequestOptionsInit
) {
  const useOptions = { ...useOpts };
  let serviceApi = getServiceApi(mcode, funName);
  return umiUesRequest((params) => {
    return serviceApi(params, reqOpts);
  }, useOptions);
}

export { uesRequest, services, getServiceApi };
