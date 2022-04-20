import { request, useRequest as umiUesRequest } from './request'

interface MethodProps {
  url: string
  method: 'get' | 'post'
  sysCode: string
}

// '/api/anony/sys/list': { methodName: 'getApplist', method: 'GET' },
const services = {
  // 模块
  system: {
    getWeightUnit: {
      url: '/base/api/anony/cargo/weight/unit/list',
      method: 'get',
      sysCode: 'common',
    },
    getApplist: {
      url: '/user/api/anony/sys/list',
      method: 'get',
      sysCode: 'common',
    },
    getDictTypeList: {
      url: '/base/api/anony/dict/value/list',
      method: 'get',
      sysCode: 'common',
    },
    areaList: {
      url: '/base/api/anony/area/children',
      method: 'get',
      sysCode: 'common',
    },
    supplier: {
      url: '/base/api/supplier/page',
      method: 'post',
      sysCode: 'base',
    },
    cooperateSupplier: {
      url: '/base/api/cooperate/supplier/page',
      method: 'post',
      sysCode: 'base',
    },
    cooperateSupplierList: {
      url: '/base/api/cooperate/supplier/list',
      method: 'post',
      sysCode: 'base',
    },
    shop: {
      url: '/base/api/shop/page',
      method: 'post',
      sysCode: 'base',
    },
    company: {
      url: '/base/api/company/list',
      method: 'get',
      sysCode: 'base',
    },
    warehouse: {
      url: '/base/api/warehouse/page',
      method: 'post',
      sysCode: 'base',
    },
    bizdept: {
      url: '/purchase/api/bizdept/list',
      method: 'post',
      sysCode: 'purchasesys',
    },
    barndList: {
      url: '/base/api/brand/list/bysize',
      method: 'get',
      sysCode: 'base',
    },
  },
  user: {
    getPublicKey: {
      url: '/user/api/anony/publickey/get',
      method: 'get',
      sysCode: 'common',
    },
    loginByPhone: {
      // url: '/user/api/anony/user/login/phonepwd',
      url: '/user/api/anony/user/pcmanage/login/phonepwd',
      method: 'post',
      sysCode: 'common',
    },
    chooseDept: {
      // url: '/user/api/dept/choose',
      url: '/user/api/pcmanage/dept/choose',
      method: 'get',
      sysCode: 'common',
    },
    chooseSys: {
      url: '/user/api/sys/choose',
      method: 'get',
      sysCode: 'common',
    },
    logout: {
      url: '/user/api/anony/user/logout',
      method: 'get',
      sysCode: 'common',
    },
    wechatCodeLogin: {
      url: '/user/api/anony/login/wechat/webapp',
      method: 'get',
      sysCode: 'common',
    },
  },
  catalog: {
    treeData: {
      url: '/base/api/catalog/downlist',
      method: 'get',
      sysCode: 'base',
    },
  },
  mall: {
    showCatalogList: {
      url: '/mallsys/api/mall/opera/mallcatalog/list',
      method: 'POST',
      sysCode: 'mallsys',
    },
    goodsCatalogList: {
      url: '/mallsys/api/mall/opera/goodscatalog/list',
      method: 'POST',
      sysCode: 'mallsys',
    },
  },
  cargo: {
    list: {
      url: '/base/api/cargo/list/bysize',
      method: 'get',
      sysCode: 'common',
    },
  },
}

// services { ...services.system, ...services.user };
// function getService<T extends keyof typeof services>(syscode:T):any

const AllReq = {}
const createRequest = (methodService: MethodProps, funName: string) => {
  const { method, url } = methodService

  const requestService = (params?: any, options?: any): Promise<any> => {
    const reqUrl = `${url}`
    const reqOpts = { ...options }
    if (method === 'get') {
      reqOpts['params'] = params
    } else {
      reqOpts['data'] = params
    }
    reqOpts['method'] = method
    return request(reqUrl, reqOpts)
  }
  const req = {}
  if (AllReq[url]) {
    req[funName] = AllReq[url]
  } else {
    req[funName] = requestService
  }

  return req
}
export function getService<T extends keyof typeof services>(mcode: T): any
export function getService<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T, ...funName: P[]): any
export function getService<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T, ...funName: P[]): any {
  let mservices = {}
  if (funName) {
    funName.forEach((item) => {
      const serviceItem: any = services[mcode][item]
      const itemReq = createRequest(serviceItem, `${item}`)
      mservices = { ...mservices, ...itemReq }
    })
    return mservices
  } else {
    const serviceItems = services[mcode]

    Object.keys(serviceItems).forEach((key) => {
      const item = services[mcode][key]
      const itemReq = createRequest(item, `${key}`)
      mservices = { ...mservices, ...itemReq }
    })
    return mservices
  }
}

function getServiceApi<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T, funName: P): (params?: any, options?: any) => Promise<any> {
  const serviceItem = getService(mcode, funName)
  //const itemReq = createRequest(`${apiUrl}`, urlItem);
  return serviceItem[funName]
}
function uesRequest<
  T extends keyof typeof services,
  P extends keyof typeof services[T]
>(mcode: T, funName: P, options?: any) {
  const useOptions = { ...options }
  return umiUesRequest(getServiceApi(mcode, funName), useOptions)
}

export { uesRequest, services, getServiceApi }
