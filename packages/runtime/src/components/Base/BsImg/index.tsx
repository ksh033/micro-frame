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

  return customSrc ? (
    <Image
      src={customSrc}
      fallback={defaultImg}
      alt=""
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
