import moment from 'moment';
import compute from '../../utils/compute';
import { toFixed2 } from '../../utils/common';

export function formatMoneyQuery(val, dotNum = 2, dw = '') {
  if (typeof val === 'number' || typeof val === 'string') {
    if (val === '0' || val === 0) {
      return `${dw}0.00`;
    }
    if (val) {
      const str = `${Number(toFixed2(val, dotNum)).toFixed(dotNum)}`;
      const intSum = str
        .substring(0, str.indexOf('.'))
        .replace(/\B(?=(?:\d{3})+$)/g, ','); // 取到整数部分
      const dot = str.substring(str.length, str.indexOf('.')); // 取到小数部分搜索
      const ret = intSum + dot;
      return dw + ret;
    }
  }
  return '--';
}

export const formatNumber = (val) => {
  if (typeof val === 'number' || typeof val === 'string') {
    if (val === '0' || val === 0) {
      return 0;
    }
    if (val)
      return val
  }
  return '--'

}

export const defaultNumber = (text: any) => {
  return text === -1 || text === '-1' ? '不限' : text;
};

export const unitprice = (text: any) => {
  if (text === undefined || text === '' || text === null) {
    return '';
  }
  const rText = typeof text === 'number' ? text : 0;
  let money = rText + '';
  if (rText % 100 !== 0) {
    money = formatMoneyQuery(compute.divide(rText, 10000), 4);
  } else {
    money = formatMoneyQuery(compute.divide(rText, 10000));
  }

  return money;
};

export const money = (text: any, isTable?: boolean) => {
  if (text === undefined || text === '' || text === null) {
    if (isTable) {
      return '--';
    }
    return ''

  }
  const rText = typeof text === 'number' ? text : 0;
  const money = formatMoneyQuery(compute.divide(rText, 10000));

  return money;
};

export const dataTime = (text: any) => {
  return moment(text).format('YYYY-MM-DD');
};

export const rate = (text: any) => {
  if (text !== undefined && text !== null) {
    return `${text}%`;
  }
  return '--';
};
