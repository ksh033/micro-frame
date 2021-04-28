/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
interface LatLng {
  lat: number
  lng: number
}
interface LatLngOut {
  longitude: number
  latitude: number
}
export function getCenterOfGravityPoint(mPoints: LatLng[]): LatLngOut {
  let area = 0.0 // 多边形面积
  let Gx = 0.0
  let Gy = 0.0 // 重心的x、y
  for (let i = 1; i <= mPoints.length; i++) {
    const iLat = mPoints[i % mPoints.length].lat
    const iLng = mPoints[i % mPoints.length].lng
    const nextLat = mPoints[i - 1].lat
    const nextLng = mPoints[i - 1].lng
    const temp = (iLat * nextLng - iLng * nextLat) / 2.0
    area += temp
    Gx += (temp * (iLat + nextLat)) / 3.0
    Gy += (temp * (iLng + nextLng)) / 3.0
  }
  Gx /= area
  Gy /= area
  return {
    latitude: Gx,
    longitude: Gy,
  }
}
Map

interface SelectItem {
  text: string
  value: any
  key: number
}

export function changeEnumToList(enumMap: any): SelectItem[] {
  const list: SelectItem[] = []
  if (enumMap) {
    Object.keys(enumMap).forEach((key: string, index: number) => {
      list.push({
        value: enumMap[key].value,
        text: enumMap[key].name,
        key: index,
      })
    })
  }

  return list
}

export function setKey(res: any[]) {
  if (Array.isArray(res)) {
    return res.map((item: any, index: number) => {
      item.key = index
      return item
    })
  }
  return []
}
// 过滤掉删除的
export function filterDeleted(res: any[]) {
  if (Array.isArray(res)) {
    return res.filter((item: any, index: number) => {
      return String(item.deleted) !== '1'
    })
  }
  return []
}

// 过滤掉未修改的
export function filterUploadData(res: any[], rowKey: string) {
  if (Array.isArray(res)) {
    return res.filter((item: any, index: number) => {
      return (
        item['_updeted'] === true ||
        String(item.deleted) === '1' ||
        item[rowKey] === undefined ||
        item[rowKey] === null ||
        item[rowKey] === ''
      )
    })
  }
  return []
}

export function compare(property: string) {
  return function (a: any, b: any) {
    const value1 = a[property]
    const value2 = b[property]
    return value1 - value2
  }
}

export function dataTableFormat(data: any) {
  if (Array.isArray(data)) {
    return {
      rows: data,
      total: data.length,
    }
  } else {
    return {
      rows: [],
      total: 0,
    }
  }
}
/**
 * 解码 URL Safe base64 -> base64
 *
 * @param {type} string
 * @description: URL Safe base64
 * '-' -> '+'
 * '_' -> '/'
 * 字符串长度%4,补'='
 * @return: Base64 string;
 */
export function urlSafeBase64Decode(base64Str: string) {
  if (!base64Str) return
  const safeStr = base64Str.replace(/-/g, '+').replace(/_/g, '/')
  const num = safeStr.length % 4
  return safeStr + '===='.substring(0, num)
}

/**
 * 编码 base64 -> URL Safe base64
 *
 * @param {type} string
 * @description: base64 '+' -> '-'
 * '/' -> '_'
 * '=' -> ''
 * @return: URL Safe base64 string;
 */
export function urlSateBase64Encode(base64Str: string) {
  if (!base64Str) return
  const safeStr = base64Str
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/\=/g, '')
  return safeStr
}

export const getHostUrl = () => {
  const { location } = window
  return `${location.protocol}//${location.host}/oms`
}

export function genNonDuplicateID(randomLength: number | undefined) {
  let str = ''
  str = Math.random().toString(36).substr(3)
  str += Date.now().toString(16).substr(4)
  return str
}

export function getMonthStartEnd() {
  const nowDate = new Date()
  const cloneNowDate = new Date()
  const fullYear = nowDate.getFullYear()
  const month = nowDate.getMonth() + 1 // getMonth 方法返回 0-11，代表1-12月
  const day = nowDate.getDate() // getMonth 方法返回 0-11，代表1-12月
  const endOfMonth = new Date(fullYear, month, 0).getDate() // 获取本月最后一天
  function getFullDate(targetDate: any) {
    let D
    let y
    let m
    let d
    if (targetDate) {
      D = new Date(targetDate)
      y = D.getFullYear()
      m = D.getMonth() + 1
      d = D.getDate()
    } else {
      y = fullYear
      m = month
      d = day
    }
    m = m > 9 ? m : `0${m}`
    d = d > 9 ? d : `0${d}`
    return `${y}-${m}-${d}`
  }
  const endDate = getFullDate(cloneNowDate.setDate(endOfMonth)) // 当月最后一天
  const starDate = getFullDate(cloneNowDate.setDate(1)) // 当月第一天
  return [starDate, endDate]
}
