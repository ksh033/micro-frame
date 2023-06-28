// @ts-ignore
import { request, useRequest as umiUesRequest } from './request';

interface MethodProps {
  url: string;
  method: 'get' | 'post';
}
const services = {
  // 模块
  system: {
    getWeightUnit: {
      url: '/base/api/anony/cargo/weight/unit/list',
      method: 'get',
    },
    getDictTypeList: {
      url: '/base/api/anony/dict/value/list',
      method: 'get',
    },
    areaList: {
      url: '/base/api/anony/area/children',
      method: 'get',
    },
    supplier: {
      url: '/base/api/supplier/page',
      method: 'post',
    },
    cooperateSupplier: {
      url: '/base/api/cooperate/supplier/page',
      method: 'post',
    },
    cooperateSupplierList: {
      url: '/base/api/cooperate/supplier/list',
      method: 'post',
    },
    shop: {
      url: '/base/api/shop/page',
      method: 'post',
    },
    company: {
      url: '/base/api/company/list',
      method: 'post',
    },
    warehouse: {
      url: '/base/api/warehouse/page',
      method: 'post',
    },
    bizdept: {
      url: '/purchase/api/bizdept/list',
      method: 'post',
    },
    barndList: {
      url: '/base/api/brand/list/bysize',
      method: 'get',
    },

    locationAreaList: {
      url: '/wms/api/locationarea/belong',
      method: 'get',
    },
    //单据关联页面服务接口
    stockBusConfig: {
      url: '/base/api/doc/page/ref/list',

    },
    getStationMapList: {
      url: '/base/api/station/presalefoods/scope',
      method: 'get',
    },

  },
  user: {
    getPublicKey: {
      url: '/user/api/anony/publickey/get',
      method: 'get',
    },
    loginByPhone: {
      url: '/user/api/anony/operator/web/login/phonepwd',
      method: 'post',
    },
    chooseDept: {
      url: '/user/api/operator/dept/choose',
      method: 'get',
    },
    logout: {
      url: '/user/api/anony/operator/logout',
      method: 'get',
    },
    wechatCodeLogin: {
      url: '/user/api/anony/operator/web/login/wechat/webapp',
      method: 'get',
    },
    todoList: {
      url: '/user/api/staff/todo/list',
      method: 'get',
    },
    deptlist: {
      url: '/user/api/currentuser/deptlist',
      method: 'get',
    },
  },
  forgetpwd: {
    smscode: {
      url: '/user/api/anony/user/forgetpwd/smscode',
      method: 'get',
    },
    checkcode: {
      url: '/user/api/anony/user/forgetpwd/checkcode',
      method: 'post',
    },
    modify: {
      url: '/user/api/anony/user/forgetpwd/modify',
      method: 'post',
    },
  },
  catalog: {
    treeData: {
      url: '/base/api/catalog/downlist',
      method: 'get',
    },
    allCatalog: {
      url: '/base/api/catalog/get/all',
      method: 'get',
    },
  },

  /** 商品品目管理 */
  mallgoods_catalog: {
    list: {
      url: '/goods/api/goods/opera/catalog/list',
      method: 'post',
    },
    treeList: {
      url: '/goods/api/goods/opera/catalog/tree',
      method: 'post',
    },
  },
  mall: {
    showCatalogList: {
      url: '/goods/api/goods/opera/classify/tree',
      method: 'POST',
    },
    goodsCatalogList: {
      url: '/goods/api/goods/opera/catalog/tree',
      method: 'POST',
    },
  },
  cargo: {
    list: {
      url: '/base/api/cargo/list/bysize',
      method: 'get',
    },
  },
};

const AllReq = {};
const createRequest = (methodService: MethodProps, funName: string) => {
  const { method, url } = methodService;

  const requestService = (params?: any, options?: any): Promise<any> => {
    const reqUrl = `${url}`;
    const reqOpts = { ...options };
    if (method === 'get') {
      reqOpts['params'] = params;
    } else {
      reqOpts['data'] = params;
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
export function getService<T extends keyof typeof services>(mcode: T): any;
export function getService<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T, ...funName: P[]): any;
export function getService<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T, ...funName: P[]): any {
  let mservices = {};
  if (funName) {
    funName.forEach((item) => {
      const serviceItem: any = services[mcode][item];
      // @ts-ignore
      const itemReq = createRequest(serviceItem, `${item}`);
      mservices = { ...mservices, ...itemReq };
    });
    return mservices;
  } else {
    const serviceItems = services[mcode];

    Object.keys(serviceItems).forEach((key) => {
      const item = services[mcode][key];
      // @ts-ignore
      const itemReq = createRequest(item, `${key}`);
      mservices = { ...mservices, ...itemReq };
    });
    return mservices;
  }
}

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
