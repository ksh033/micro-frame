import { BasePluginvoke, Print } from '@scboson/client-plugin';
import { message } from 'antd';
import { request } from './request';

export const getHostUrl = () => {
  //@ts-ignore
  const { location, publicPath } = window;
  // const appCode = getAppCode();
  return `${publicPath}`;
};

let _printObject: Print | null = null;

export const getPrintObject = () => {
  if (!_printObject) {
    _printObject = new Print({
      appId: 'bosssoft',
      cookie: '1123',
      hostUrl: getHostUrl(),
      downLoadUrl: '',
      queryTempListUrl: '',
      queryTempNameUrl: '',
    });
    const config = _printObject.getConfig();
    config.companyClient = '长嘴猫客户端';
    config.url = config.url.replace('https:', 'http:');
    config.guardUrl = config.guardUrl.replace('https:', 'http:');
  }

  return _printObject;
};

export type PrintCfg = {
  moduleId: string;
  moduleName: string;
  tplName: string;
  dataUrl: string;
  method?: string;
};
export enum PrintTplType {
  /** 溯源码 */
  traceSource = '00000001',
  /** 商品价签码 */
  priceTag = '00000002',
  /** 盘点单 */
  checkOrder = '00000003',
  /** 收货单 */
  receiverOrder = '00000004',
  /** 出库单 */
  stockOutOrder = '00000005',
  /** 收货单针式 */
  receiverOrderZhen = '000000041',
  /** 出库单针式 */
  stockOutOrderZhen = '000000051',
}

const printList: { [key: string]: PrintCfg } = {
  '00000001': {
    moduleId: '00000001',
    moduleName: '溯源码',
    tplName: 'traceSourceCode.grf',
    dataUrl: '/code/api/trace/code/print',
    method: 'post',
  },
  '00000002': {
    moduleId: '00000002',
    moduleName: '商品价签码',
    tplName: 'priceTag.grf',
    dataUrl: '/mallsys/api/mall/opera/pricetag/print',
    method: 'post',
  },
  '00000003': {
    moduleId: '00000003',
    moduleName: '盘点单',
    tplName: 'checkOrder.grf',
    dataUrl: '/wms/api/checkorder/reprint',
    method: 'get',
  },
  '00000004': {
    moduleId: '00000004',
    moduleName: '收货单',
    tplName: 'receiverOrder.grf',
    dataUrl: '/transportsys/api/transport/order/print',
    method: 'get',
  },
  '00000005': {
    moduleId: '00000005',
    moduleName: '出库单',
    tplName: 'stockOutOrder.grf',
    dataUrl: '/purchase/api/stock/order/print',
    method: 'get',
  },
  '000000041': {
    moduleId: '000000041',
    moduleName: '收货单',
    tplName: 'receiverOrder_zhen.grf',
    dataUrl: '/transportsys/api/transport/order/print',
    method: 'get',
  },
  '000000051': {
    moduleId: '000000051',
    moduleName: '出库单',
    tplName: 'stockOutOrder_zhen.grf',
    dataUrl: '/purchase/api/stock/order/print',
    method: 'get',
  },
};

export interface PrintProps {
  loadReportURL?: string;
  preview?: boolean;
  data?: any;
  printSet?: any;
  url?: string;
  method?: string;
  params?: any;
  isZhen?: boolean;
}
const checkClient = (): Promise<Boolean> => {
  const key = 'updatable';

  return BasePluginvoke.heartbeat()
    .then(() => {
      return Promise.resolve(true);
    })
    .catch((d: any) => {
      message.loading({ content: '打印控件启动中...', key });
      /** 当BsService 进程未被关闭时，可以通过发送jsonp请求启动 当BsService 被关闭时，通过注册表启动 */
      return BasePluginvoke.startClient('jsonp')
        .then((c: any) => {
          message.success({
            content: '打印控件启动成功,请重点打印!',
            key,
            duration: 2,
          });
          return Promise.resolve(true);
        })
        .catch((b: any) => {
          return BasePluginvoke.startClient('url').then((a: any) => {
            if (a) {
              message.success({
                content: '打印控件启动成功,请重点打印!',
                key,
                duration: 2,
              });
            }
            return Promise.resolve(false);
          });
        });
    });
};
// print.setPrinter({ ModuleId: '00000001',"ModuleName":"小票单" })
export const setPrintSetting = (moduleId: string): any => {
  if (moduleId) {
    const printObject = getPrintObject();

    const printCfg = printList[moduleId];
    printObject.setPrinter({
      ModuleId: printCfg.moduleId,
      ModuleName: printCfg.moduleName,
    });
  }
};
export const print = async (moduleId: string, options: PrintProps) => {
  const printObject = getPrintObject();
  const start = await checkClient();
  if (!start) {
    // message.warning('打印服务启动中')
    return Promise.reject();
  }
  if (moduleId && printList[moduleId]) {
    const printCfg = printList[moduleId];
    if (printCfg) {
      const {
        params,
        url = printCfg.dataUrl,
        method = printCfg.method || 'get',
        preview,
        loadReportURL = `${getHostUrl()}/grf_file/${printCfg.tplName}`,
      } = options;

      const printParams = {
        ModuleId: printCfg.moduleId,
        ModuleName: printCfg.moduleName,
      };
      const printData = await printObject.getPrintSet(printParams);
      if (printData) {
        let temData = {};
        if (method === 'get') {
          temData = { params };
        } else {
          temData = { data: params };
        }
        const data = await request(url, { method, ...temData });
        printObject.doPreview({
          LoadReportURL: loadReportURL,
          PrintPreview: preview || false,
          PrintData: data,
          PrintSet: printData,
          ShowForm: true,
        });
        return Promise.resolve(data);
      } else {
        return Promise.reject();
      }
    }
  }
  return Promise.reject();
};
