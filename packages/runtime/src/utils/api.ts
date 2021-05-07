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
    getApplist: {
      url: '/user/api/anony/sys/list',
      method: 'get',
      sysCode: 'common',
    },
    getDictTypeList: {
      url: '/base/api/dict/value/list',
      method: 'get',
      sysCode: 'common',
    },
    areaList: {
      url: '/base/api/area/children',
      method: 'get',
      sysCode: 'common',
    },
  },
  user: {
    loginByPhone: {
      url: '/user/api/anony/user/login/dev',
      method: 'get',
      sysCode: 'common',
    },
    chooseDept: {
      url: '/user/api/dept/choose',
      method: 'get',
      sysCode: 'common',
    },
    chooseSys: {
      url: '/user/api/sys/choose',
      method: 'get',
      sysCode: 'common',
    },
    logout: {
      url: '/user/api/user/logout',
      method: 'get',
      sysCode: 'common',
    },
  },
}

// services { ...services.system, ...services.user };
// function getService<T extends keyof typeof services>(syscode:T):any

const AllReq = {}
const createRequest = (methodService: MethodProps, funName: string) => {
  const { method, url, sysCode } = methodService

  const requestService = (params?: any, options?: any): Promise<any> => {
    const reqUrl = `${url}`
    const reqOpts = { ...options, headers: { sys_code: sysCode } }
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
