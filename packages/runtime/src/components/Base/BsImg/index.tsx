/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Image } from 'antd'
import styles from './index.less'
import { imageUrl } from '../../../utils/common'

const BsImg: React.FC<any> = (props) => {
  const defaultImg =
    'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABIAAD/4QMqaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODU3RjQ3NkVGQjRGMTFFQjhFQkM5Njk4RUY4MDQ3OUYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODU3RjQ3NkZGQjRGMTFFQjhFQkM5Njk4RUY4MDQ3OUYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NTdGNDc2Q0ZCNEYxMUVCOEVCQzk2OThFRjgwNDc5RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4NTdGNDc2REZCNEYxMUVCOEVCQzk2OThFRjgwNDc5RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAQDAwMDAwQDAwQFAwMDBQYFBAQF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'
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
