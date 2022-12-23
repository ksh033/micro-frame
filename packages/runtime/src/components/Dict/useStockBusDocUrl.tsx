import { uesRequest } from '../../utils/api'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSafeState, useSessionStorageState } from 'ahooks'
import { openWindow } from '../Auth';




let stockBusDocUrl: any;
let setModelState = (val: any) => {
  stockBusDocUrl = val;
};

type StockBusDoc = {
  /**
   * 组织机构类型
   */
  bizDeptType: string;
  /**
   * 业务单据关联页面ID
   */
  bizDocPageRefId: string;
  /**
   * 单据类型
   */
  bizDocTypeCode: string;
  /**
   * 单据类型名称
   */
  bizDocTypeName: string;
  /**
   * 页面地址
   */
  pageUrl: string;
  /**
   * 查询字段


   */
  queryField: string;
}
/**
 * 库存流水关联单据链接
 * @returns 
 */
export default function useStockBusDocUrl() {

  const { run } = uesRequest('system', 'stockBusConfig')


  const getData = async (): Promise<any> => {
    let temBusDocUrls: any = null
    if (!stockBusDocUrl) {
      const list: StockBusDoc[] = await run()
      if (list.length > 0) {
        temBusDocUrls = {}
      }
      list.forEach((item) => {

        temBusDocUrls[item.bizDocTypeCode] = item
      })

    }
    return temBusDocUrls
  }
  useEffect(() => {
    getData().then((data) => {
      setModelState(data)
    })
  }, [])
  const [state, setState] = useSafeState(stockBusDocUrl);
  setModelState = (val: any) => {

    setState(val);
  };



  const StockBusDocLink = (props: { value: any, record: any, filedName: string }) => {
    const { value, record, filedName } = props
    const bizDocTypeCode = record[filedName];

    const [url, setUrl] = useSafeState('');
    const getBusDocUrl = (bizDocTypeCode: string) => {

      let url = "";
      if (bizDocTypeCode && state) {

        const item: StockBusDoc = state[bizDocTypeCode];

        if (item) {

          url = `${item.pageUrl}?${item.queryField}=${value}`

        }

      }


      return url;
    }
    useEffect(() => {

      const url = getBusDocUrl(bizDocTypeCode)

      setUrl(url)
    }, [state])
    return bizDocTypeCode && url ? <a onClick={() => {

      openWindow(url)
    }}>{value}</a> : value


  }


  const renderStockLink = (v, record) => {

    return <StockBusDocLink value={v} record={record} filedName="relateDocType"></StockBusDocLink>
  }
  return { StockBusDocLink, renderStockLink }
}