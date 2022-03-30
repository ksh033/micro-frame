import { User } from '../components/Auth'

// @ts-ignore
export const baseUrl = SC_GLOBAL_IMG_URL || 'https://testepay.bstj.com/bg/img'

// @ts-ignore
export const baseApi = SC_GLOBAL_API_URL || '/api'

export function imageUrl(url: string) {
  const str = RegExp('http')
  let newUrl: string | null = null
  // 通过三元运算符进行判断该图片是否含有http域名，没有就拼接上去
  if (url) {
    if (str.test(url)) {
      newUrl = url
    } else {
      if (url.substr(0, 1) !== '/') {
        url = `/${url}`
      }
      newUrl = `${baseUrl}${url}`
    }
  }

  return newUrl
}
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

export function colorRgba(sHex: string, alpha?: number): string {
  if (!alpha) {
    alpha = 1
  }
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`))
    }
    // return sColorChange.join(',')
    // 或
    return `rgba(${sColorChange.join(',')},${alpha})`
  } else {
    return sColor
  }
}

export function initUser(token: string, systemCode: string): User {
  return {
    systemList: [],
    lastLoginTime: '',
    realName: '',
    needModifyPwd: false,
    token: token,
    phone: 'string',
    userName: 'string',
    userAppInfo: {
      currentSystem: {
        systemCode: systemCode,
        systemName: '',
        defaulted: true,
        enabled: true,
        publiced: '',
      },
      currentDept: {
        bizDeptId: '',
        bizDeptName: '',
        bizDeptType: '',
        contactName: '',
        contactPhone: '',
        subcompanyId: '',
        subcompanyName: '',
      },
      deptList: [],
      needChooseDept: false,
      menuTreeNodeList: [],
    },
    email: '',
    superAdminFlag: false,
    wechatAvatarUrl: null,
    wechatNickname: null,
    wechatUnionId: null,
  }
}

export function toFixed2(val, decimal = 2) {
  // console.log(this, decimal)
  if (Number(decimal) < 0 && Number(decimal) > 100) {
    return RangeError('toFixed() digits argument must be between 0 and 100')
  }
  if (val === undefined || val === null || val === '') {
    return 0
  }
  // 按小数点分割，得到整数位及小数位
  // 按保留小数点位数分割小数位，得到需保留的小数位
  // 将需保留的小数位与整数位拼接得到四舍五入之前的结果
  // 对需四舍五入的小数最大一位数进行四舍五入，如果大于等于5则进位flag为1，否则为0
  // 对四舍五入之前的结果+进位flag进行四舍五入得到最终结果

  let numberStr = val + ''
  let reg = /^(-|\+)?(\d+(\.\d*)?|\.\d+)$/i
  if (!reg.test(numberStr)) {
    console.error('输入的数字格式不对')
    return
  }
  let sign = numberStr.trim().charAt(0) === '-' ? -1 : 1 // 判断是否是负数
  if (sign === -1) {
    numberStr = numberStr.slice(1)
  }
  let pointIndex = numberStr.indexOf('.') // 记录小数点的位置
  if (pointIndex > -1) {
    numberStr = numberStr.replace('.', '')
  } else {
    // 没有小数点直接添加补0；
    numberStr += '.'
    numberStr += new Array(decimal).join('0')
    return sign === -1 ? '-' + numberStr : numberStr
  }
  let numberArray: any[] = numberStr.split('') //转成数组
  let len = numberArray.length
  let oldPointNum = len - pointIndex // 获取原数据有多少位小数
  if (oldPointNum < decimal) {
    // 要保留的小数点比原来的要大，直接补0
    while (decimal - oldPointNum > 0) {
      numberArray.push('0')
      decimal--
    }
  } else if (oldPointNum > decimal) {
    // 模拟四舍五入

    let i = oldPointNum - decimal // 从倒数第i个数字开始比较
    let more = numberArray[len - i] >= 5 ? true : false
    while (more) {
      i++
      more = +numberArray[len - i] + 1 === 10 ? true : false // 进位后判断是否等于10，是则继续进位
      numberArray[len - i] =
        more && i !== len + 1 ? 0 : +numberArray[len - i] + 1 // 其他位置的数字进位直接变成0，第一位的例外
    }
    numberArray.length = len - (oldPointNum - decimal) // 截取多余的小数
  }
  numberArray.splice(pointIndex, 0, '.')
  return sign === -1 ? '-' + numberArray.join('') : numberArray.join('')
}

export function decimalPoint(val, dotNum = 2) {
  if (typeof val === 'number' || typeof val === 'string') {
    if (val === '0' || val === 0) {
      return `0`
    }
    let newVal = val
    // 科学计数法
    if (/^(\d+(?:\.\d+)?)(e)([\-]?\d+)$/.test(String(val))) {
      const temp = /^(\d{1,}(?:,\d{3})*\.(?:0*[1-9]+)?)(0*)?$/.exec(String(val))
      if (temp) {
        newVal = temp[1]
      } else {
        newVal = Number(newVal).toFixed(dotNum)
      }
    }
    if (newVal) {
      return Number(toFixed2(newVal, dotNum))
    }
    return '--'
  }
  return '--'
}
