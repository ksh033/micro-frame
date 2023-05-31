// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!

import { notification, message } from "antd";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
// @ts-ignore
import { history } from "@@/core/history";
//import useUmiRequest, { UseRequestProvider } from '@ahooksjs/use-request';

import useUmiRequest from "ahooks/es/useRequest";
import {
  Options,
  Service,
  Plugin,
  Result,
} from "ahooks/es/useRequest/src/types";
import type Fetch from "ahooks/es/useRequest/src/Fetch";
//import { ApplyPluginsType } from 'umi';
//import { getPluginManager } from '../core/plugin';
import { getUser, clearUser } from "../components/Auth";
import { baseApi } from "../utils/common";
import queryString from "query-string";
export enum ExtendMethod {
  FILEUPLOAD = "FILEUPLOAD",
}

// import {
//   BaseOptions,
//   BasePaginatedOptions,
//   BaseResult,
//   CombineService,
//   LoadMoreFormatReturn,
//   LoadMoreOptions,
//   LoadMoreOptionsWithFormat,
//   LoadMoreParams,
//   LoadMoreResult,
//   OptionsWithFormat,
//   PaginatedFormatReturn,
//   PaginatedOptionsWithFormat,
//   PaginatedParams,
//   PaginatedResult,
// } from '@ahooksjs/use-request/es/types';
export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  IResponseInterceptor as ResponseInterceptor,
  IRequestOptions,
  IRequest as Request,
  Options,
  Service,
  Plugin,
  Result,
};

export type RequestOptions = IRequestOptions;
export interface BaseOptions<TData, TParams extends any[]> extends Options { }
type ResultWithData<T = any> = { data?: T;[key: string]: any };
export enum ErrorShowType {
  SILENT = "0",
  WARN_MESSAGE = "1",
  ERROR_MESSAGE = "2",
  NOTIFICATION = "4",
  REDIRECT = "9",
}
interface ResponseStructure {
  success: boolean;
  data?: any;
  errorCode?: string;
  errorMessage?: string;
  errorShowType?: ErrorShowType;
  traceId?: string;
  host?: string;
  [key: string]: any;
}

type CustomResult<TData, TParams extends any[]> = Omit<
  Result<TData, TParams>,
  "run"
> & {
  run: Fetch<TData, TParams>["runAsync"];
  runSync: Fetch<TData, TParams>["run"];
};

/**
 * 文件下载
 *
 * @param content
 * @param fileName
 */
const download = (content: any, fileName: string) => {
  const blob = new Blob([content], {
    type: "application/vnd.ms-excel",
  });
  const a = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  // 文件中文URL解码
  const filename = decodeURI(fileName);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

// function useRequest<
//   R = any,
//   P extends any[] = any,
//   U = any,
//   UU extends U = any,
// >(
//   service: CombineService<R, P>,
//   options: OptionsWithFormat<R, P, U, UU>,
// ): BaseResult<U, P>;
// function useRequest<R extends ResultWithData = any, P extends any[] = any>(
//   service: CombineService<R, P>,
//   options?: BaseOptions<R['data'], P>,
// ): BaseResult<R['data'], P>;
// function useRequest<R extends LoadMoreFormatReturn = any, RR = any>(
//   service: CombineService<RR, LoadMoreParams<R>>,
//   options: LoadMoreOptionsWithFormat<R, RR>,
// ): LoadMoreResult<R>;
// function useRequest<
//   R extends ResultWithData<LoadMoreFormatReturn | any> = any,
//   RR extends R = any,
// >(
//   service: CombineService<R, LoadMoreParams<R['data']>>,
//   options: LoadMoreOptions<RR['data']>,
// ): LoadMoreResult<R['data']>;

// function useRequest<R = any, Item = any, U extends Item = any>(
//   service: CombineService<R, PaginatedParams>,
//   options: PaginatedOptionsWithFormat<R, Item, U>,
// ): PaginatedResult<Item>;
// function useRequest<Item = any, U extends Item = any>(
//   service: CombineService<
//     ResultWithData<PaginatedFormatReturn<Item>>,
//     PaginatedParams
//   >,
//   options: BasePaginatedOptions<U>,
// ): PaginatedResult<Item>;

function useRequest<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>,
  Request?: RequestOptions
): CustomResult<TData, TParams> {
  const result = useUmiRequest(service, {
    // formatResult: result => result?.data,
    // requestMethod: (requestOptions: any) => {
    //   if (typeof requestOptions === 'string') {
    //     return request(requestOptions);
    //   }
    //   if (typeof requestOptions === 'object') {
    //     const { url, ...rest } = requestOptions;
    //     return request(url, rest);
    //   }
    //   throw new Error('request options error');
    // },
    manual: true,
    // throwOnError: true,
    ...options,
  });

  const { run, runAsync, ...props } = result;
  const newResult: CustomResult<TData, TParams> = props;
  newResult.runSync = run;
  newResult.run = runAsync;
  return newResult;
}

// request 方法 opts 参数的接口
interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  requestInterceptors?: IRequestInterceptorTuple[];
  responseInterceptors?: IResponseInterceptorTuple[];
  messageType?: ErrorShowType;
  returnMessage?: string;
  showMessage?: boolean;
  formatType?: "table" | "list";
  [key: string]: any;
}

interface IRequestOptionsWithResponse extends IRequestOptions {
  getResponse: true;
}

interface IRequestOptionsWithoutResponse extends IRequestOptions {
  getResponse: false;
}

interface IRequest {
  <T = any>(url: string, opts: IRequestOptionsWithResponse): Promise<
    AxiosResponse<T>
  >;
  <T = any>(url: string, opts: IRequestOptionsWithoutResponse): Promise<T>;
  <T = any>(url: string, opts: IRequestOptions): Promise<T>; // getResponse 默认是 false， 因此不提供该参数时，只返回 data
  <T = any>(url: string): Promise<T>; // 不提供 opts 时，默认使用 'GET' method，并且默认返回 data
}

interface IErrorHandler {
  (error: any, opts: IRequestOptions): void;
}
type IRequestInterceptorAxios = (config: IRequestOptions) => IRequestOptions;
type IRequestInterceptorUmiRequest = (
  url: string,
  config: RequestOptions
) => { url: string; options: RequestOptions };
type IRequestInterceptor = IRequestInterceptorAxios;
type IErrorInterceptor = (error: Error) => Promise<Error>;
type IResponseInterceptor = <T = any>(
  response: AxiosResponse<T>
) => AxiosResponse<T> | Promise<T>;
type IRequestInterceptorTuple =
  | [IRequestInterceptor, IErrorInterceptor]
  | [IRequestInterceptor]
  | IRequestInterceptor;
type IResponseInterceptorTuple =
  | [IResponseInterceptor, IErrorInterceptor]
  | [IResponseInterceptor]
  | IResponseInterceptor;

export interface RequestConfig extends AxiosRequestConfig {
  errorConfig?: {
    errorHandler?: IErrorHandler;
    errorThrower?: <T>(res: T) => void;
  };
  requestInterceptors?: IRequestInterceptorTuple[];
  responseInterceptors?: IResponseInterceptorTuple[];
}
const DEFAULT_ERROR_PAGE = "/exception";
let requestInstance: AxiosInstance;
// 运行时配置
const config: RequestConfig = {
  // 统一的请求设定

  headers: { "X-Requested-With": "XMLHttpRequest" },
  paramsSerializer(params) {
    return queryString.stringify(params);
  }, // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: <ResponseStructure>(res) => {
      const {
        success,
        data,
        errorCode,
        errorMessage,
        errorShowType,
        errorShowTip,
      } = res;
      if (!success) {
        const error: any = {};
        error.name = "BizError";
        error.info = {
          errorCode,
          errorMessage,
          errorShowType,
          data,
          errorShowTip,
        };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === "BizError") {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode, errorShowTip } = errorInfo;
          const errormsg = errorShowTip || errorMessage;

          if (errorCode === "A100002") {
            // window.location="/login";
            const his = window.masterHistory || history;
            clearUser();
            message.warn(errorInfo.errorShowTip || errorInfo.errorMessage);
            his.push({
              pathname: "/login",
            });
            return;
          }
          switch (errorInfo?.errorShowType) {
            case ErrorShowType.SILENT:
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warn(errormsg);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errormsg);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                message: errormsg,
              });
              break;
            case ErrorShowType.REDIRECT:
              // @ts-ignore
              history.push({
                pathname: `${errorPage}?errorCode=${errorCode}&errormsg=${errormsg}`,
              });
              // redirect to error page
              break;
            default:
              message.error(errormsg);
              break;
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error("None response! Please retry.");
      } else {
        // 发送请求时出了点问题
        message.error("Request error, please retry.");
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config) => {
      const { url = "", ...options } = config;
      const user = getUser();
      const headers: any = { version: "1.0", ...options.headers };
      if (user) {
        headers.token = user.token;
      }

      const newOptions = { ...options, headers };

      // 处理图片上传
      if (
        options.method &&
        options.method.toUpperCase() === ExtendMethod.FILEUPLOAD
      ) {
        newOptions.method = "POST";

        //  newOptions.responseType = 'blob'
        newOptions.headers["Content-Type"] = "multipart/form-data";
        const dataParament: any = newOptions.params;
        const filedata = new FormData();
        if (dataParament.fileLists) {
          const filesLists = dataParament.fileLists;
          // 这里可以包装多文件
          // eslint-disable-next-line no-restricted-syntax
          for (const key in filesLists) {
            if (filesLists.hasOwnProperty(key)) {
              if (Array.isArray(filesLists[key])) {
                for (let i = 0; i < filesLists[key].length; i++) {
                  if (filesLists[key][i].originFileObj) {
                    filedata.append(key, filesLists[key][i].originFileObj);
                  }
                }
              } else if (filesLists[key].originFileObj) {
                filedata.append(key, filesLists[key].originFileObj);
              }
            }
          }
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const item in dataParament) {
          if (item !== "fileLists") {
            if (
              item !== null &&
              dataParament[item] !== undefined &&
              dataParament[item] !== null
            ) {
              // 除了文件之外的 其他参数 用这个循环加到filedata中
              filedata.append(item, dataParament[item]);
            }
          }
        }
        newOptions.params = filedata;
      }
      let sp = "/";
      if (url && url.charAt(0) === "/") {
        sp = "";
      }
      let newUrl = sp + url;
      if (url.indexOf(baseApi) === -1) {
        newUrl = baseApi + newUrl;
      }

      // console.log(baseApi);
      return {
        url: newUrl,
        ...newOptions,
      };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    async (response) => {

      const disposition = response.headers.get("Content-Disposition");

      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = disposition.split(filenameRegex);
        let filename = "download.xsl";
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }

        download(await response.blob(), filename);

        return Promise.resolve({
          success: true,
        });
      } else {
        return response;
      }
    },
  ]
};
// const getConfig = (): RequestConfig => {
//   if (config) return config;
//   config = getPluginManager().applyPlugins({
//     key: 'request',
//     type: ApplyPluginsType.modify,
//     initialValue: {},
//   });
//   return config;
// };

const getRequestInstance = (): AxiosInstance => {
  if (requestInstance) return requestInstance;
  //const config = getConfig();
  requestInstance = axios.create(config);

  config?.requestInterceptors?.forEach((interceptor) => {
    if (interceptor instanceof Array) {
      requestInstance.interceptors.request.use((config) => {
        const { url } = config;
        if (interceptor[0].length === 2) {
          const { url: newUrl, options } = interceptor[0](url, config);
          return { ...options, url: newUrl };
        }
        return interceptor[0](config);
      }, interceptor[1]);
    } else {
      requestInstance.interceptors.request.use((config) => {
        const { url } = config;
        if (interceptor.length === 2) {
          const { url: newUrl, options } = interceptor(url, config);
          return { ...options, url: newUrl };
        }
        return interceptor(config);
      });
    }
  });

  config?.responseInterceptors?.forEach((interceptor) => {
    interceptor instanceof Array
      ? requestInstance.interceptors.response.use(
        interceptor[0],
        interceptor[1]
      )
      : requestInstance.interceptors.response.use(interceptor);
  });

  // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理。
  requestInstance.interceptors.response.use((response) => {
    const { data } = response;
    if (data?.success === false && config?.errorConfig?.errorThrower) {
      config.errorConfig.errorThrower(data);
    } else {
      const options = response.config;

      let resData = data;
      const formatType = options.formatType;
      if (formatType) {
        if (formatType === "list") {
          if (resData.data.records) {
          }
          resData.data = resData.data.records;
        }
        if (formatType === "table") {
          resData.data = {
            records: resData.data,
          };
        }
      }
      if (resData.data && resData.data.records) {
        resData.data.rows = resData.data.records;
        delete resData.data.records;
      }
      if (options?.showMessage) {
        message.success("操作成功");
      }
      response.data = resData.data;
    }

    return response;
  });
  return requestInstance;
};

const request: IRequest = (url: string, opts: any = { method: "GET" }) => {
  const requestInstance = getRequestInstance();
  //const config = getConfig();
  const {
    getResponse = false,
    requestInterceptors,
    responseInterceptors,
  } = opts;
  const requestInterceptorsToEject = requestInterceptors?.map((interceptor) => {
    if (interceptor instanceof Array) {
      return requestInstance.interceptors.request.use((config) => {
        const { url } = config;
        if (interceptor[0].length === 2) {
          const { url: newUrl, options } = interceptor[0](url, config);
          return { ...options, url: newUrl };
        }
        return interceptor[0](config);
      }, interceptor[1]);
    } else {
      return requestInstance.interceptors.request.use((config) => {
        const { url } = config;
        if (interceptor.length === 2) {
          const { url: newUrl, options } = interceptor(url, config);
          return { ...options, url: newUrl };
        }
        return interceptor(url, config);
      });
    }
  });
  const responseInterceptorsToEject = responseInterceptors?.map(
    (interceptor) => {
      return interceptor instanceof Array
        ? requestInstance.interceptors.response.use(
          interceptor[0],
          interceptor[1]
        )
        : requestInstance.interceptors.response.use(interceptor);
    }
  );
  return new Promise((resolve, reject) => {
    requestInstance
      .request({ ...opts, url })
      .then((res) => {
        requestInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.request.eject(interceptor);
        });
        responseInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.response.eject(interceptor);
        });
        resolve(getResponse ? res : res.data);
      })
      .catch((error) => {
        requestInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.request.eject(interceptor);
        });
        responseInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.response.eject(interceptor);
        });
        try {
          const handler = config?.errorConfig?.errorHandler;
          if (handler) handler(error, opts);
        } catch (e) {
          reject(e);
        }
        reject(error);
      });
  });
};

export {
  useRequest,

  // UseRequestProvider,
  request,
  getRequestInstance,
};
