/*
 * 判断obj是否为一个整数
 */
// function isInteger(obj: number) {
//   return Math.floor(obj) === obj;
// }

/*
 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param floatNum {number} 小数
 * @return {object}
 *   {times:100, num: 314}
 */
// function toInteger(floatNum: number) {
//   const ret = { times: 1, num: 0 };
//   if (isInteger(floatNum)) {
//     ret.num = floatNum;
//     return ret;
//   }
//   const strfi = `${floatNum}`;
//   const dotPos = strfi.indexOf('.');
//   const len = strfi.substr(dotPos + 1).length;
//   // eslint-disable-next-line no-restricted-properties
//   const times = Math.pow(10, len);
//   const intbef = floatNum * times + 0.5;
//   const intNum = parseInt(`${intbef}`, 10);
//   ret.times = times;
//   ret.num = intNum;
//   return ret;
// }

/** Used as references for various `Number` constants. */
const INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
const symbolToString = Symbol.prototype.toString;

function isSymbol(value) {
  const type = typeof value;
  return (
    type == 'symbol' ||
    (type === 'object' &&
      value != null &&
      Object.prototype.toString.call(value) == '[object Symbol]')
  );
}

function baseToNumber(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return 0 / 0;
  }
  return +value;
}

function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return `${value.map(baseToString)}`;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  const result = `${value}`;
  return result === '0' && 1 / value === -INFINITY ? '-0' : result;
}

/**
 * Creates a function that performs a mathematical operation on two values.
 *
 * @private
 * @param {Function} operator The function to perform the operation.
 * @param {number} [defaultValue] The value used for `undefined` arguments.
 * @returns {Function} Returns the new mathematical operation function.
 */
function createMathOperation(operator, defaultValue) {
  return (value, other) => {
    if (value === undefined && other === undefined) {
      return defaultValue;
    }
    if (value !== undefined && other === undefined) {
      return value;
    }
    if (other !== undefined && value === undefined) {
      return other;
    }
    if (typeof value === 'string' || typeof other === 'string') {
      value = baseToString(value);
      other = baseToString(other);
    } else {
      value = baseToNumber(value);
      other = baseToNumber(other);
    }
    return operator(value, other);
  };
}

// function operation(a: any, b: any, op: string) {
//   const o1 = toInteger(a);
//   const o2 = toInteger(b);
//   const n1 = o1.num;
//   const n2 = o2.num;
//   const t1 = o1.times;
//   const t2 = o2.times;
//   const max = t1 > t2 ? t1 : t2;
//   let result: number | null = null;
//   switch (op) {
//     case 'add':
//       if (t1 === t2) {
//         // 两个小数位数相同
//         result = n1 + n2;
//       } else if (t1 > t2) {
//         // o1 小数位 大于 o2
//         result = n1 + n2 * (t1 / t2);
//       } else {
//         // o1 小数位 小于 o2
//         result = n1 * (t2 / t1) + n2;
//       }
//       return result / max;
//     case 'subtract':
//       if (t1 === t2) {
//         result = n1 - n2;
//       } else if (t1 > t2) {
//         result = n1 - n2 * (t1 / t2);
//       } else {
//         result = n1 * (t2 / t1) - n2;
//       }
//       return result / max;
//     case 'multiply':
//       result = (n1 * n2) / (t1 * t2);
//       return result;
//     case 'divide':
//       result = (n1 / n2) * (t2 / t1);
//       return result;
//     default:
//       return 0;
//   }
// }

// 加减乘除的四个接口
// 加
// function add(a: any, b: any) {
//   return operation(a, b, 'add');
// }
// // 减
// function subtract(a: any, b: any) {
//   return operation(a, b, 'subtract');
// }
// // 乘
// function multiply(a: any, b: any) {
//   return operation(a, b, 'multiply');
// }
// // 除
// function divide(a: any, b: any) {
//   return operation(a, b, 'divide');
// }

export default {
  add: createMathOperation((augend, addend) => augend + addend, 0),
  subtract: createMathOperation(
    (minuend, subtrahend) => minuend - subtrahend,
    0
  ),
  multiply: createMathOperation(
    (multiplier, multiplicand) => multiplier * multiplicand,
    1
  ),
  divide: createMathOperation((dividend, divisor) => dividend / divisor, 1),
};
