/* eslint-disable consistent-return */
import React, { useLayoutEffect, useState } from 'react'
import { ScUpload } from '@scboson/sc-element'
import { UploadFile } from '@scboson/sc-element/es/sc-upload'
import { PlusOutlined } from '@ant-design/icons'
import { imageUrl } from '../../../utils/common'
import { FileType } from './index'
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
  valeFormat?: (data: any) => Promise<string | FileType | null>
}

const MultipleUpload: React.FC<MultipleUpload> = (props: MultipleUpload) => {
  const {
    value = [],
    onChange,
    action,
    beforeUpload,
    accept,
    headers,
    valeFormat,
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
              uid: index + '',
              url: imageUrl(item),
              fileUrl: item,
              status: 'done',
            }
          } else {
            return {
              uid: index + '',
              url: imageUrl(item.url),
              fileUrl: item.url,
              fileInfoId: item.fileId || item.fileInfoId,
              thumbnailUrl: item.thumb_url || item.thumbnailUrl,
              status: 'done',
            }
          }
        })
        .filter((item) => item !== null)
    } else {
      newfileList = []
    }
    return newfileList
  }

  const [fileList, setFileList] = useState<UploadFile[]>([])

  useLayoutEffect(() => {
    setFileList(formatList(value))
  }, [JSON.stringify(value)])

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div>上传</div>
    </div>
  )

  const handleChange = async ({
    fileList: _fileList,
  }: {
    fileList: UploadFile[]
  }) => {
    const rfileList = _fileList.filter((item) => {
      if (item.status === 'done') {
        return true
      } else {
        if (item.size && item.type) {
          return maxSizeCheck(item)
        }
        return true
      }
    })

    const doneList = _fileList.filter((it) => it.status === 'done')
    if (doneList.length === _fileList.length) {
      const outList: any[] = []
      for (let i = 0; i < _fileList.length; i++) {
        const file = _fileList[i]
        if (file.status === 'done') {
          let result: any = file
          if (file.response && file.response.success) {
            result = file.response.data
          }
          if (valeFormat && result) {
            result = await valeFormat(result)
            outList.push(result)
          } else {
            outList.push(result)
          }
        }
      }
      onChange?.(outList)
    } else {
      setFileList(rfileList)
    }
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
