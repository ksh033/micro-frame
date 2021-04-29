/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { imageUrl } from '../../../utils/common'
import styles from './index.less'

const BsVideo: React.FC<any> = (props) => {
  const { src, ...restProps } = props
  const [customSrc, setCustomSrc] = useState(() => {
    return imageUrl(src)
  })

  useUpdateEffect(() => {
    setCustomSrc(imageUrl(src))
  }, [src])

  return (
    <video controls className={styles['bs-video']}>
      <source src={customSrc} type="video/mp4" {...restProps} />
    </video>
  )
}

export default BsVideo
