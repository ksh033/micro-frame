/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react'
import { message } from 'antd'
import { baseApi } from '../../../utils/common'
import {
  FormComponentProps,
  FormComponent,
} from '@scboson/sc-element/es/c-form'
import { getUser } from '../../Auth'
import SingleUpload from './SingleUpload'
import MultipleUpload from './MultipleUpload'
import BsImg from '../BsImg'
import compute from '../../../utils/compute'
import styles from './index.less'

interface BsUploadProps extends FormComponentProps {
  action?: string
  value?: any[]
  onChange?: (value: any[]) => void
  maxFiles?: number // 最多上传几个配合 mode 类型为 multiple
  mode?: 'multiple' | 'single' // single 上传一个 |  multiple 上传多个配合maxFiles使用
  disabled?: boolean // 是否禁用
  maxSize?: number // 上传文件大小
  videoMaxSize?: number // 视频的文件大小
  uploadImmediately?: boolean // 是否立即上传
  accept?: string // 图片上传类型
  warnContent?: React.ReactNode | string
}

const isImageFileType = (type: string): boolean => type.indexOf('image/') > -1

const BsUpload: FormComponent<BsUploadProps> = (props: BsUploadProps) => {
  const {
    maxFiles = 1,
    mode = 'single',
    disabled = false,
    maxSize = 3 * 1024 * 1024,
    videoMaxSize = 8 * 1024 * 1024,
    action = `${baseApi}/file/api/file/upload`,
    uploadImmediately = true,
    accept = 'image/*',
    warnContent,
    readonly,
    initialValues,
    name,
    ...restProps
  } = props
  const user = getUser()
  const headers: any = { 'app-version': '1.0' }
  if (user) {
    headers.token = user.token
    headers['sys-code'] = user.userAppInfo.currentSystem.systemCode
  } else {
    headers['sys-code'] = 'common'
  }

  const maxSizeM = compute.divide(maxSize, 1024 * 1024)
  const videoMaxSizeM = compute.divide(videoMaxSize, 1024 * 1024)

  const maxSizeCheck = (file: any) => {
    const isImg = isImageFileType(accept)
    if (isImg) {
      return file.size <= maxSize
    }
    const isVideo = file.type.indexOf('video') > -1

    if (isVideo) {
      return file.size <= videoMaxSize
    }

    return false
  }

  const beforeUpload = (file: any) => {
    if (file.type.indexOf('image') > -1) {
      const isJpgOrPng = file.type && file.type.indexOf('image') > -1
      const isLt2M = file.size <= maxSize
      // 判断是否有url 如果有就立即上传，没有就不上传，而是改为手动提交
      if (!isJpgOrPng) {
        message.error('请上传JPG/PNG的图片格式')
        return false
      }

      if (!isLt2M) {
        message.error(`图片大小必须小于${maxSizeM}M!`)
        return false
      }
      if (uploadImmediately) {
        return isJpgOrPng && isLt2M
      } else {
        return false
      }
    }
    if (file.type.indexOf('video') > -1) {
      const isJpgOrPng = file.type && file.type.indexOf('video') > -1
      const isLt2M = file.size <= videoMaxSize
      // 判断是否有url 如果有就立即上传，没有就不上传，而是改为手动提交
      if (!isJpgOrPng) {
        message.error('请上传视频')
        return false
      }
      if (!isLt2M) {
        message.error(`视频大小必须小于${videoMaxSizeM}M!`)
        return false
      }
      if (uploadImmediately) {
        return isJpgOrPng
      } else {
        return false
      }
    }

    return false
  }

  if (readonly) {
    if (Array.isArray(restProps.value)) {
      return (
        <div className={styles['bs-upload-img-list']}>
          {restProps.value.map((item, index: number) => {
            return (
              <div className={styles['bs-upload-img']} key={index}>
                <BsImg src={item}></BsImg>{' '}
              </div>
            )
          })}
        </div>
      )
    } else {
      return (
        <div className={styles['bs-upload-img']}>
          <BsImg src={restProps.value}></BsImg>
        </div>
      )
    }
  }

  const dataFormat = (result: any): string | null => {
    let fileUrl = null
    if (result && result.fileUrl) {
      fileUrl = result.fileUrl
    }
    if (fileUrl === null) {
      fileUrl = result.url
    }
    return fileUrl
  }

  return (
    <div>
      {mode === 'single' ? (
        <SingleUpload
          disabled={disabled}
          maxSize={maxSize}
          action={action}
          uploadImmediately={uploadImmediately}
          beforeUpload={beforeUpload}
          accept={accept}
          headers={headers}
          dataFormat={dataFormat}
          maxSizeCheck={maxSizeCheck}
          {...restProps}
        ></SingleUpload>
      ) : (
        <MultipleUpload
          disabled={disabled}
          maxSize={maxSize}
          action={action}
          beforeUpload={beforeUpload}
          accept={accept}
          headers={headers}
          dataFormat={dataFormat}
          maxSizeCheck={maxSizeCheck}
          {...restProps}
        ></MultipleUpload>
      )}
      {warnContent || null}
    </div>
  )
}

BsUpload.customView = true
export default BsUpload
