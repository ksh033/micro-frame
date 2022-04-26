/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import {
  extend,
  RequestMethod,
  RequestOptionsInit,
  RequestResponse,
  Context,
  RequestOptionsWithResponse,
  RequestOptionsWithoutResponse,
} from 'umi-request'
import { notification, message } from 'antd'
// @ts-ignore
import { history } from 'umi'
import { getUser, clearUser } from '../components/Auth'
// import {useRequest as useUmiRequest} from 'ahooks';
import useUmiRequest from '@ahooksjs/use-request'
import {
  BaseOptions,
  BasePaginatedOptions,
  BaseResult,
  CombineService,
  LoadMoreFormatReturn,
  LoadMoreOptions,
  LoadMoreOptionsWithFormat,
  LoadMoreParams,
  LoadMoreResult,
  OptionsWithFormat,
  PaginatedFormatReturn,
  PaginatedOptionsWithFormat,
  PaginatedParams,
  PaginatedResult,
} from '@ahooksjs/use-request/es/types'

type ResultWithData<T = any> = { data?: T; [key: string]: any }
import { baseApi } from './common'

/**
 * 文件下载
 *
 * @param content
 * @param fileName
 */
const download = (content: any, fileName: string) => {
  const blob = new Blob([content], {
    type: 'application/vnd.ms-excel',
  })
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  // 文件中文URL解码
  const filename = decodeURI(fileName)
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export enum ExtendMethod {
  FILEUPLOAD = 'FILEUPLOAD',
}

export enum ErrorShowType {
  SILENT = '0',
  WARN_MESSAGE = '1',
  ERROR_MESSAGE = '2',
  NOTIFICATION = '4',
  REDIRECT = '9',
}
interface ErrorInfoStructure {
  success: boolean
  data?: any
  errorCode?: string
  errorMessage?: string
  showType?: ErrorShowType
  traceId?: string
  host?: string
  [key: string]: any
}

interface RequestError extends Error {
  data?: any
  info?: ErrorInfoStructure
  request?: Context['req']
  response?: Context['res']
}
let requestMethodInstance: RequestMethod
const DEFAULT_ERROR_PAGE = '/exception'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

export interface CustomRequestOptionsInit extends  RequestOptionsInit {
  messageType?: ErrorShowType
  returnMessage?: string
  showMessage?: boolean
  formatType?: 'table' | 'list',
  skipErrorHandler?: boolean
}




const getRequestMethod = () => {
  if (requestMethodInstance) {
    return requestMethodInstance
  }
  const errorAdaptor = (resData: any, ctx: any) => resData
  requestMethodInstance = extend({
    errorHandler: (error: RequestError) => {
      // @ts-ignore
      if (error?.request?.options?.skipErrorHandler) {
        throw error
      }
      let errorInfo: ErrorInfoStructure | undefined
      if (error.name === 'ResponseError' && error.data && error.request) {
        const ctx: Context = {
          req: error.request,
          res: error.response,
        }
        errorInfo = errorAdaptor(error.data, ctx)
        error.message = errorInfo?.errorMessage || error.message
        error.data = error.data
        error.info = errorInfo
      }
      errorInfo = error.info

      if (errorInfo && errorInfo.errorCode === 'A100002') {
        // window.location="/login";

        //@ts-ignore
        const his = window.masterHistory || history
        clearUser()
        his.push({
          pathname: '/login',
        })
        return
      }
      if (errorInfo) {
        const { errorMessage, errorShowTip } = errorInfo
        const { errorCode } = errorInfo
        const errorPage = DEFAULT_ERROR_PAGE
        // requestConfig.errorConfig?.errorPage || DEFAULT_ERROR_PAGE;

        const errormsg = errorShowTip || errorMessage
        switch (errorInfo?.errorShowType) {
          case ErrorShowType.SILENT:
            break
          case ErrorShowType.WARN_MESSAGE:
            message.warn(errormsg)
            break
          case ErrorShowType.ERROR_MESSAGE:
            message.error(errormsg)
            break
          case ErrorShowType.NOTIFICATION:
            notification.open({
              message: errormsg,
            })
            break
          case ErrorShowType.REDIRECT:
            // @ts-ignore
            history.push({
              pathname: errorPage,
              query: { errorCode, errormsg },
            })
            // redirect to error page
            break
          default:
            message.error(errormsg)
            break
        }
      } else {
        message.error(error.message || 'Request error, please retry.')
      }

      throw error
    },
  })
  requestMethodInstance.interceptors.request.use(
    (
      url: string,
      options: CustomRequestOptionsInit 
    ) => {
      const user = getUser()
      const headers: any = { version: '1.0', ...options.headers }
      if (user) {
        headers.token = user.token
        headers['sys-code'] = 'common'
      } else {
        headers['sys-code'] = 'common'
      }

      const newOptions = { ...options, headers }
      // 处理图片上传
      if (
        options.method &&
        options.method.toUpperCase() === ExtendMethod.FILEUPLOAD
      ) {
        newOptions.method = 'POST'
        const dataParament: any = newOptions.body
        const filedata = new FormData()
        if (dataParament.fileLists) {
          const filesLists = dataParament.fileLists
          // 这里可以包装多文件
          // eslint-disable-next-line no-restricted-syntax
          for (const key in filesLists) {
            if (filesLists.hasOwnProperty(key)) {
              if (Array.isArray(filesLists[key])) {
                for (let i = 0; i < filesLists[key].length; i++) {
                  if (filesLists[key][i].originFileObj) {
                    filedata.append(key, filesLists[key][i].originFileObj)
                  }
                }
              } else if (filesLists[key].originFileObj) {
                filedata.append(key, filesLists[key].originFileObj)
              }
            }
          }
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const item in dataParament) {
          if (item !== 'fileLists') {
            if (
              item !== null &&
              dataParament[item] !== undefined &&
              dataParament[item] !== null
            ) {
              // 除了文件之外的 其他参数 用这个循环加到filedata中
              filedata.append(item, dataParament[item])
            }
          }
        }
        newOptions.body = filedata
      }
      let sp = '/'
      if (url && url.charAt(0) === '/') {
        sp = ''
      }
      let newUrl = sp + url
      if (url.indexOf(baseApi) === -1) {
        newUrl = baseApi + newUrl
      }

      // console.log(baseApi);
      return {
        url: newUrl,
        options: newOptions,
      }
    }
  )
  // 文件下载处理

  // @ts-ignore
  requestMethodInstance.interceptors.response.use(async (response) => {
    const disposition = response.headers.get('Content-Disposition')

    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = disposition.split(filenameRegex)
      let filename = 'download.xsl'
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '')
      }

      download(await response.blob(), filename)

      return Promise.resolve({
        success: true,
      })
    } else {
      return response
    }
  })

  // 中间件统一错误处理
  // 后端返回格式 { success: boolean, data: any }
  // 按照项目具体情况修改该部分逻辑
  requestMethodInstance.use(async (ctx, next) => {
    await next()
    const { req, res } = ctx
    // @ts-ignore
    if (req.options?.skipErrorHandler) {
      return
    }

    const { options } = req
    const { getResponse } = options

    const resData = getResponse ? res.data : res

    const errorInfo = errorAdaptor(resData, ctx)
    // errorInfo.success = false
    if (errorInfo.success === false) {
      // 抛出错误到 errorHandler 中处理
      const error: RequestError = new Error(errorInfo.errorMessage)
      // error.name = 'BizError';
      error.data = resData
      error.info = errorInfo
      throw error
    } else {
      // @ts-ignore
      const formatType = req.options.formatType
      if (formatType) {
        if (formatType === 'list') {
          if (resData.data.records) {
          }
          resData.data = resData.data.records
        }
        if (formatType === 'table') {
          resData.data = {
            records: resData.data,
          }
        }
      }
      if (resData.data && resData.data.records) {
        resData.data.rows = resData.data.records
        delete resData.data.records
      }
      if (req.options?.showMessage) {
        message.success("操作成功")
      }
  
      ctx.res = resData.data
      // Promise.resolve(resData.data)
    }
  })
  return requestMethodInstance
}
export interface RequestMethodInUmi<R = false> {
  <T = any>(
    url: string,
    options: CustomRequestOptionsInit
  ): Promise<RequestResponse<T>>
  <T = any>(
    url: string,
    options: CustomRequestOptionsInit 
  ): Promise<T>
  <T = any>(
    url: string,
    options?: CustomRequestOptionsInit 
  ): R extends true ? Promise<RequestResponse<T>> : Promise<T>
}

const request: RequestMethodInUmi = (url: any, options?: CustomRequestOptionsInit) => {
  const requestMethod = getRequestMethod()
  return requestMethod(url, options)
}
function useRequest<
  R = any,
  P extends any[] = any,
  U = any,
  UU extends U = any
>(
  service: CombineService<R, P>,
  options: OptionsWithFormat<R, P, U, UU>
): BaseResult<U, P>
function useRequest<R extends ResultWithData = any, P extends any[] = any>(
  service: CombineService<R, P>,
  options?: BaseOptions<R['data'], P>
): BaseResult<R['data'], P>
function useRequest<R extends LoadMoreFormatReturn = any, RR = any>(
  service: CombineService<RR, LoadMoreParams<R>>,
  options: LoadMoreOptionsWithFormat<R, RR>
): LoadMoreResult<R>
function useRequest<
  R extends ResultWithData<LoadMoreFormatReturn | any> = any,
  RR extends R = any
>(
  service: CombineService<R, LoadMoreParams<R['data']>>,
  options: LoadMoreOptions<RR['data']>
): LoadMoreResult<R['data']>

function useRequest<R = any, Item = any, U extends Item = any>(
  service: CombineService<R, PaginatedParams>,
  options: PaginatedOptionsWithFormat<R, Item, U>
): PaginatedResult<Item>
function useRequest<Item = any, U extends Item = any>(
  service: CombineService<
    ResultWithData<PaginatedFormatReturn<Item>>,
    PaginatedParams
  >,
  options: BasePaginatedOptions<U>
): PaginatedResult<Item>

function useRequest(service: any, options: any = {}) {
  // const defaultOptions= {manual:true}
  return useUmiRequest(service, {
    requestMethod: (requestOptions: any) => {
      if (typeof requestOptions === 'string') {
        return request(requestOptions)
      }
      if (typeof requestOptions === 'object') {
        const { url, ...rest } = requestOptions
        return request(url, rest)
      }
      throw new Error('request options error')
    },
    manual: true,
    throwOnError: true,
    ...options,
  })
}

export { request, useRequest ,BaseOptions}
