// @ts-ignore
export const baseUrl = bogengkeji_imgUrl || 'https://testepay.bstj.com/bg/img'

// @ts-ignore
export const baseApi = bogengkeji || '/api'

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
