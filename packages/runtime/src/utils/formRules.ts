import { Rule } from 'antd/es/form'

type Record<K extends keyof any, T> = {
  [P in K]: T
}

type Rules = 'phone' | 'email' | 'upc' | 'businessLicense' | 'bank' | 'idCard'

const formRules: Record<Rules, Rule> = {
  phone: {
    pattern: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
    message: '请输入正确的手机号',
  },
  email: {
    type: 'email',
    message: '请输入正确的邮箱地址',
  },
  upc: {
    pattern: /^69\d{11}$/,
    message: '请输入以69开头的13位数字',
  },
  businessLicense: {
    pattern: /^([A-Z0-9]{15}|[A-Z0-9]{18})$/,
    message: '请输入正确的社会信用代码',
  },
  bank: { pattern: /^[1-9]\d{9,29}$/, message: '请输入正确的银行账号' },
  idCard: {
    pattern: /^(\d{18,18}|\d{15,15}|\d{17,17}X)$/,
    message: '请输入正确的证件号码',
  },
}

export default formRules
