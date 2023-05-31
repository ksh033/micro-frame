/*
 * 判断obj是否为一个整数
 */
function isInteger(obj: number) {
  return Math.floor(obj) === obj;
}

function isSymbol(value: null) {
  const type = typeof value;
  return (
    type == "symbol" ||
    (type === "object" &&
      value != null &&
      Object.prototype.toString.call(value) == "[object Symbol]")
  );
}

function baseToNumber(value: any) {
  if (typeof value === "number") {
    return value;
  }
  if (isSymbol(value)) {
    return 0 / 0;
  }
  if (value == null) {
    return 0;
  }
  return +value;
}

/*
 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param floatNum {number} 小数
 * @return {object}
 *   {times:100, num: 314}
 */
function toInteger(floatNum: number) {
  const ret = { times: 1, num: 0 };
  if (isInteger(floatNum)) {
    ret.num = floatNum;
    return ret;
  }
  const strfi = `${floatNum}`;
  const dotPos = strfi.indexOf(".");
  const len = strfi.substr(dotPos + 1).length;
  // eslint-disable-next-line no-restricted-properties
  const times = Math.pow(10, len);
  const intbef = floatNum * times + 0.5;
  const intNum = parseInt(`${intbef}`, 10);
  ret.times = times;
  ret.num = intNum;
  return ret;
}

function operation(a: any, b: any, op: string) {
  const o1 = toInteger(a);
  const o2 = toInteger(b);
  const n1 = o1.num;
  const n2 = o2.num;
  const t1 = o1.times;
  const t2 = o2.times;
  const max = t1 > t2 ? t1 : t2;
  let result: number | null = null;
  switch (op) {
    case "add":
      if (t1 === t2) {
        // 两个小数位数相同
        result = n1 + n2;
      } else if (t1 > t2) {
        // o1 小数位 大于 o2
        result = n1 + n2 * (t1 / t2);
      } else {
        // o1 小数位 小于 o2
        result = n1 * (t2 / t1) + n2;
      }
      return result / max;
    case "subtract":
      if (t1 === t2) {
        result = n1 - n2;
      } else if (t1 > t2) {
        result = n1 - n2 * (t1 / t2);
      } else {
        result = n1 * (t2 / t1) - n2;
      }
      return result / max;
    case "multiply":
      result = (n1 * n2) / (t1 * t2);
      return result;
    case "divide":
      result = (n1 / n2) * (t2 / t1);
      return result;
    default:
      return 0;
  }
}

// 加减乘除的四个接口
// 加
function add(a: any, b: any) {
  const arg1 = baseToNumber(a);
  const arg2 = baseToNumber(b);
  let r1: number, r2: number, m: number;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}
// 减
function subtract(a: any, b: any) {
  const arg1 = baseToNumber(a);
  const arg2 = baseToNumber(b);
  var r1: number, r2: number, m: number, n: number | undefined;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  var m1 = Math.pow(10, Math.max(r1, r2) - r1);
  var m2 = Math.pow(10, Math.max(r1, r2) - r2);

  var r1_integer = Number(arg1.toString().replace(".", "")) * m1;

  var r2_integer = Number(arg2.toString().replace(".", "")) * m2;

  n = r1 >= r2 ? r1 : r2;
  return Number(((r1_integer - r2_integer) / m).toFixed(n));
}
// 乘
function multiply(a: any, b: any) {
  const arg1 = baseToNumber(a);
  const arg2 = baseToNumber(b);
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m)
  );
}
// 除
function divide(a: any, b: any) {
  return operation(a, b, "divide");
}

export default {
  add,
  subtract,
  multiply,
  divide,
};
