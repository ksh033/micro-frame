/* eslint-disable consistent-return */
import React, { useState } from 'react'
import { ScUpload } from '@scboson/sc-element'
import { UploadFile } from '@scboson/sc-element/es/sc-upload'

import { PlusOutlined } from '@ant-design/icons'
import { imageUrl } from '../../../utils/common'
import { useUpdateEffect } from 'ahooks'

interface MultipleUpload {
  action?: string
  value?: any[]
  onChange?: (value: any[]) => void
  maxFiles?: number // 最多上传几个配合 mode 类型为 multiple
  disabled?: boolean // 是否禁用
  maxSize?: number // 上传文件大小
  maxSizeCheck: (file: any) => boolean
  beforeUpload?: (file: any, fileList: any) => boolean | Promise<any>
  accept?: string
  headers?: any
  dataFormat?: (data: any) => string | null
}

const MultipleUpload: React.FC<MultipleUpload> = (props: MultipleUpload) => {
  const {
    value = [],
    onChange,
    action,
    beforeUpload,
    accept,
    headers,
    dataFormat,
    maxSizeCheck,
    ...restProps
  } = props
  const formatList = (_fileList: any) => {
    let newfileList = JSON.parse(JSON.stringify(_fileList))
    if (Array.isArray(newfileList)) {
      newfileList = newfileList
        .map((item, index) => {
          if (typeof item === 'string') {
            return {
              uid: index,
              url: imageUrl(item),
              fileUrl: item,
              status: 'done',
            }
          } else {
            let result = item
            if (item.size && item.type) {
              if (maxSizeCheck(item)) {
                if (item.response && item.response.success) {
                  result = item.response.data
                }
                if (dataFormat) {
                  result = dataFormat(result)
                }
                item.url = imageUrl(result)
                return item
              } else {
                return null
              }
            } else {
              return item
            }
          }
        })
        .filter((item) => item !== null)
    } else {
      newfileList = []
    }
    return newfileList
  }

  useUpdateEffect(() => {
    if (Array.isArray(fileList) && fileList.length === 0) {
      setFileList(formatList(value))
    }
  }, [JSON.stringify(value)])

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div>上传</div>
    </div>
  )

  const handleChange = ({
    fileList: _fileList,
  }: {
    fileList: UploadFile[]
  }) => {
    const rfileList = formatList(_fileList)
    setFileList(rfileList)
    onChange && onChange(rfileList)
  }

  return (
    <ScUpload
      action={action}
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
      accept={accept}
      beforeUpload={beforeUpload}
      headers={headers}
      {...restProps}
    >
      {fileList.length >= 9 ? null : uploadButton}
    </ScUpload>
  )
}

export default MultipleUpload
