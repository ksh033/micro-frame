import { Print, BasePluginvoke } from '@scboson/client-plugin'
import { message } from 'antd'
import { request } from './request'
import { getAppCode } from '../components/Auth/index'

export const getHostUrl = () => {
  const { location } = window
  const appCode = getAppCode()
  return `${location.protocol}//${location.host}/${appCode}`
}

export const printObject = new Print({
  appId: 'bosssoft',
  cookie: '1123',
  hostUrl: getHostUrl(),
  downLoadUrl: '',
  queryTempListUrl: '',
  queryTempNameUrl: '',
})
printObject.config.companyClient = '长嘴猫客户端'
printObject.config.url = printObject.config.url.replace('https:', 'http:')
printObject.config.guardUrl = printObject.config.guardUrl.replace(
  'https:',
  'http:'
)
export type PrintCfg = {
  moduleId: string
  moduleName: string
  tplName: string
  dataUrl: string
  method?: string
}
export enum PrintTplType {
  /** 溯源码 */
  traceSource = '00000001',
}

const printList: { [key: string]: PrintCfg } = {
  '00000001': {
    moduleId: '00000001',
    moduleName: '溯源码',
    tplName: 'traceSourceCode.grf',
    dataUrl: '/code/api/trace/code/print',
    method: 'post',
  },
}

export interface PrintProps {
  loadReportURL?: string
  preview?: boolean
  data?: any
  printSet?: any
  url?: string
  method?: string
  params?: any
}
const checkClient = (): Promise<Boolean> => {
  const key = 'updatable'

  return BasePluginvoke.heartbeat()
    .then(() => {
      return Promise.resolve(true)
    })
    .catch((d: any) => {
      message.loading({ content: '打印控件启动中...', key })
      /** 当BsService 进程未被关闭时，可以通过发送jsonp请求启动 当BsService 被关闭时，通过注册表启动 */
      return BasePluginvoke.startClient('jsonp')
        .then((c: any) => {
          message.success({
            content: '打印控件启动成功,请重点打印!',
            key,
            duration: 2,
          })
          return Promise.resolve(true)
        })
        .catch((b: any) => {
          return BasePluginvoke.startClient('url').then((a: any) => {
            if (a) {
              message.success({
                content: '打印控件启动成功,请重点打印!',
                key,
                duration: 2,
              })
            }
            return Promise.resolve(false)
          })
        })
    })
}
// print.setPrinter({ ModuleId: '00000001',"ModuleName":"小票单" })
export const setPrintSetting = (moduleId: string): any => {
  if (moduleId) {
    const printCfg = printList[moduleId]
    printObject.setPrinter({
      ModuleId: printCfg.moduleId,
      ModuleName: printCfg.moduleName,
    })
  }
}
export const print = async (moduleId: string, options: PrintProps) => {
  const start = await checkClient()
  if (!start) {
    // message.warning('打印服务启动中')
    return
  }
  if (moduleId) {
    const printCfg = printList[moduleId]
    if (printCfg) {
      const {
        params,
        url = printCfg.dataUrl,
        method = printCfg.method || 'get',
        preview = false,
        loadReportURL = `${getHostUrl()}/grf_file/${printCfg.tplName}`,
      } = options
      const printParams = {
        ModuleId: printCfg.moduleId,
        ModuleName: printCfg.moduleName,
      }
      const printData = await printObject.getPrintSet(printParams)
      if (printData) {
        let temData = {}
        if (method === 'get') {
          temData = { params }
        } else {
          temData = { data: params }
        }
        const data = await request(url, { method, ...temData })
        const reulst = await printObject.doPreview({
          LoadReportURL: loadReportURL,
          PrintPreview: preview,
          PrintData: data,
          PrintSet: printData,
          ShowForm: true,
        })
        Promise.resolve(reulst)
      } else {
        Promise.reject()
      }
    }
  }
}
