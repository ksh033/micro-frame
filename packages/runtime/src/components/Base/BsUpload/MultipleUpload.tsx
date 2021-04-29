/* eslint-disable consistent-return */
import React, { useState } from 'react'
import { UploadFile } from 'antd/lib/upload/interface'
import { ScUpload } from '@scboson/sc-element'
import { PlusOutlined } from '@ant-design/icons'
import { imageUrl } from '../../../utils/common'

interface MultipleUpload {
  action?: string
  value?: any[]
  onChange?: (value: any[]) => void
  maxFiles?: number // 最多上传几个配合 mode 类型为 multiple
  disabled?: boolean // 是否禁用
  maxSize?: number
  beforeUpload?: (file: any, fileList: any) => boolean | Promise<any>
  accept?: string
  headers?: any
}

const MultipleUpload: React.FC<MultipleUpload> = (props: MultipleUpload) => {
  const {
    value = [],
    onChange,
    action,
    beforeUpload,
    accept,
    headers,
    ...restProps
  } = props
  const formatList = (_fileList: any) => {
    let newfileList = JSON.parse(JSON.stringify(_fileList))
    if (Array.isArray(newfileList)) {
      newfileList = newfileList.map((item) => {
        item.url = imageUrl(item.url)
        return item
      })
    } else {
      newfileList = []
    }
    return newfileList
  }
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    return formatList(value)
  })

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
    setFileList(formatList(_fileList))
    onChange && onChange(_fileList)
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
