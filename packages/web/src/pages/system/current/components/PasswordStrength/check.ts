export function chenkPwdStrength(password: string): number {
  if (password === null || password === undefined) {
    return 0
  }
  password = password.trim()
  /** 提取长度 */
  const length = password.length
  const lscore = lengthScore(length)

  /** 提取数字 */
  const numberArray: RegExpMatchArray | null = password.match(/\d+/g)
  const num = numberArray ? numberArray.join('') : ''
  const nscore = numScore(num)
  /** 提取字母 */
  const strArray: RegExpMatchArray | null = password.match(/[a-zA-Z]+/g)
  const str = strArray ? strArray.join('') : ''
  const sscore = strScore(str)
  /** 提取特殊符号 */
  const charArray: RegExpMatchArray | null = password.match(
    /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g
  )
  const char = charArray ? charArray.join('') : ''
  const cscore = charScore(char)
  /** 额外分数 */
  const existscore = addScore(password)
  console.log('lscore', lscore)
  console.log('nscore', nscore)
  console.log('sscore', sscore)
  console.log('cscore', cscore)
  return lscore + nscore + sscore + cscore + existscore
}

function lengthScore(length: number) {
  if (length > 0) {
    if (length <= 4) {
      return 5
    } else if (length <= 7 && length >= 5) {
      return 10
    } else {
      return 25
    }
  } else {
    return 0
  }
}

function numScore(str: string) {
  const length = str.length
  if (length === 0) {
    return 0
  } else if (length === 1) {
    return 10
  } else {
    return 20
  }
}

function strScore(str: string) {
  const bigStr: RegExpMatchArray | null = str.match(/[^A-Z]/g)
  const smallStr: RegExpMatchArray | null = str.match(/[^a-z]/g)

  const bigNum = (bigStr ? bigStr.join('') : '').length
  const smallNum = (smallStr ? smallStr.join('') : '').length
  if (bigNum === 0 && smallNum === 0) {
    return 0
  }
  if (bigNum === 0 || smallNum === 0) {
    return 10
  } else {
    return 20
  }
}

function charScore(str: string) {
  const length = str.length
  if (length === 0) {
    return 0
  } else if (length === 1) {
    return 10
  } else {
    return 25
  }
}

function addScore(str: string) {
  // 大小写字母、数字和符号
  if (
    /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、])+$)$/.test(
      str
    )
  ) {
    return 5
  }
  // 字母、数字和符号
  if (
    /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]$/.test(str)
  ) {
    return 3
  }
  // 字母和数字
  if (/^(?=.*\d)(?=.*[a-zA-Z])$/.test(str)) {
    return 2
  }
  return 0
}
