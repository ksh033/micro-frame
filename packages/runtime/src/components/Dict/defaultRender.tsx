/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Badge } from 'antd'
import { SupplierStatus, IntroType } from './constant'
import BsImg from '../Base/BsImg'
// import { DictDataItem } from '@/models/userDictModel';
import moment from 'moment'

export function formatMoneyQuery(val, dotNum = 2, dw = '') {
  if (typeof val === 'number' || typeof val === 'string') {
    if (val === '0' || val === 0) {
      return `${dw}0.00`
    }
    if (val) {
      // 金额转换 分->元 保留2位小数 并每隔3位用逗号分开 1,234.56
      const str = `${parseFloat(`${val}`).toFixed(dotNum)}`
      const intSum = str
        .substring(0, str.indexOf('.'))
        .replace(/\B(?=(?:\d{3})+$)/g, ',') // 取到整数部分
      const dot = str.substring(str.length, str.indexOf('.')) // 取到小数部分搜索
      const ret = intSum + dot
      return dw + ret
    }
  }
  return '--'
}

const status = (text: any) => {
  let result: any = '--'
  if (text === true) {
    result = <Badge color="#73D13D" text="启用" />
  }
  if (text === false) {
    result = <Badge color="#FFA940" text="停用" />
  }
  return result
}

const supplierStatus = (text: string | number | React.ReactText[]) => {
  let result = text
  switch (text) {
    case SupplierStatus.ENABLE.value:
      result = SupplierStatus.ENABLE.name
      break
    case SupplierStatus.DISABLE.value:
      result = SupplierStatus.DISABLE.name
      break
    default:
      result = '--'
      break
  }
  return result
}

const introType = (text: string | number | React.ReactText[]) => {
  let result = text
  switch (text) {
    case IntroType.MASTER.value:
      result = IntroType.MASTER.name
      break
    case IntroType.SLIDESHOW.value:
      result = IntroType.SLIDESHOW.name
      break
    case IntroType.DETAIL.value:
      result = IntroType.DETAIL.name
      break
    case IntroType.VIDEO.value:
      result = IntroType.VIDEO.name
      break

    case IntroType.ARTICLES.value:
      result = IntroType.ARTICLES.name
      break
    default:
      result = '--'
      break
  }
  return result
}

/**
 * 根据不同的类型来转化数值
 *
 * @param text
 * @param valueType
 */
const defaultRenderText = <T, U>(
  text: string | number | React.ReactText[],
  valueType: string,
  record: any = {}
): React.ReactNode => {
  if (valueType === 'defaultNumber') {
    return text === -1 || text === '-1' ? '不限' : text
  }
  if (valueType === 'money') {
    if (text === undefined || text === '' || text === null) {
      return ''
    }
    const rText = typeof text === 'number' ? text : 0
    let money = rText + ''
    if (rText % 100 !== 0) {
      money = formatMoneyQuery(rText / 10000, 4)
    } else {
      money = formatMoneyQuery(rText / 10000)
    }

    return money !== '' ? money : money
  }
  if (valueType === 'dataTime') {
    const timeMoment = moment(text).format('YYYY-MM-DD')
    return timeMoment
  }
  if (valueType === 'status') {
    return status(text)
  }

  if (valueType === 'supplierStatus') {
    return supplierStatus(text)
  }
  if (valueType === 'introType') {
    return introType(text)
  }
  if (valueType === 'media') {
    return <BsImg src={text} />
  }
  return text
}

export const cacheRender = (
  text: string | number | React.ReactText[],
  list: any[]
): React.ReactNode => {
  if (Array.isArray(list)) {
    const index = list.findIndex((item: any) => {
      return item.value === `${text}`
    })
    if (index > -1) {
      return list[index].name
    }
  }

  return text
}

export default defaultRenderText
