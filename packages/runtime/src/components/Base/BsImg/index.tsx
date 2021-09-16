/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Image } from 'antd'
import styles from './index.less'
import { imageUrl } from '../../../utils/common'
import defaultImg from '../../../assets/defaultImg.jpg'

const BsImg: React.FC<any> = (props) => {
  const { src, ...restProps } = props
  const [customSrc, setCustomSrc] = useState(() => {
    return imageUrl(src)
  })

  useUpdateEffect(() => {
    setCustomSrc(imageUrl(src))
  }, [src])

  const breviaryUrl = (url) => {
    var newUrl = url
    var pattern = /[^\.]\w*$/
    if (url && url.indexOf('_200x200') === -1) {
      const name = newUrl.match(pattern)
      if (name && name[0] !== 'gif') {
        newUrl = newUrl.replace('.' + name[0], '_200x200.' + name[0])
      }
    }
    return newUrl
  }

  return customSrc ? (
    <Image
      src={breviaryUrl(customSrc)}
      fallback={defaultImg}
      alt=""
      preview={{
        src: customSrc,
      }}
      {...restProps}
      className={styles['bs-img']}
    />
  ) : (
    <Image
      src={defaultImg}
      alt=""
      {...restProps}
      className={styles['bs-img']}
    />
  )
}

export default BsImg
