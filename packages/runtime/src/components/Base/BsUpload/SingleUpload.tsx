/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import { imageUrl } from '../../../utils/common';
import styles from './index.less';
import { FileType } from './index';

function getBase64(file: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

interface SingleUploadProps {
  action?: string;
  value?: any;
  onChange?: (value: any[]) => void;
  disabled?: boolean; // 是否禁用
  uploadImmediately?: boolean; // 是否立即上传
  maxSize?: number; // 上传文件大小
  maxSizeCheck: (file: any) => boolean;
  beforeUpload?: (file: any, fileList: any) => boolean | Promise<any>;
  accept?: string;
  headers?: object;
  valeFormat?: (data: any) => Promise<string | FileType | null>;
}
const isImageFileType = (type?: string): boolean =>
  type?.indexOf('image/') === 0;

const SingleUpload: React.FC<SingleUploadProps> = (
  props: SingleUploadProps
) => {
  const {
    onChange,
    disabled = false,
    action,
    value,
    beforeUpload,
    accept,
    uploadImmediately = true,
    headers,
    maxSizeCheck,
    valeFormat,
  } = props;

  const [previewImage, setPreviewImage] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);

  const handlePreview = async (file: UploadFile) => {
    if (isImageFileType(file.type)) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
    }
  };

  useEffect(() => {
    if (typeof value === 'string') {
      setPreviewImage(value);
    } else {
      setPreviewImage(value && value.url ? value.url : null);
    }
  }, [JSON.stringify(value)]);

  const handleChange = async ({ file }: any) => {
    if (!maxSizeCheck(file)) {
      return;
    }

    if (uploadImmediately) {
      if (file.status === 'uploading') {
        setPreviewImage(null);
        setLoading(true);
        return;
      }
      setLoading(false);
      if (file.status === 'done') {
        handlePreview(file);
        let result = file;
        if (file.response && file.response.success) {
          result = file.response.data;
        } else {
          message.error('上传失败');
          return;
        }
        if (valeFormat) {
          result = await valeFormat(result);
        }

        if (typeof result === 'string') {
          setPreviewImage(result);
        } else {
          setPreviewImage(result && result.url ? result.url : null);
        }
        onChange && onChange(result);
      }
    } else {
      onChange && onChange(file);
    }
  };

  const preView = (_file: string) => {
    if (_file.includes('base64')) {
      return (
        <img
          src={_file}
          alt="avatar"
          style={{ width: '100%' }}
          className={styles['bs-upload-view-img']}
        />
      );
    } else {
      const file = imageUrl(_file);
      if (file && file !== '') {
        if (/\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(file)) {
          return (
            <img
              src={file}
              alt="avatar"
              className={styles['bs-upload-view-img']}
            />
          );
        }
        if (/\.(mp4|rmvb|avi|ts)$/.test(file)) {
          return (
            <video controls autoPlay className={styles['bs-upload-video']}>
              <source src={file} type="video/mp4" />
            </video>
          );
        }
      }
      return null;
    }
  };

  const uploadExtraProps: any = {};

  if (action) {
    uploadExtraProps.action = action;
  }

  const uploadButton = loading ? (
    <div>
      <LoadingOutlined />
      <div style={{ marginTop: 8 }}>上传中</div>
    </div>
  ) : (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <div className="bs-signle-img clearfix">
      <Upload
        listType="picture-card"
        showUploadList={false}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        disabled={disabled}
        accept={accept}
        headers={headers}
        {...uploadExtraProps}
      >
        {previewImage ? preView(previewImage) : uploadButton}
      </Upload>
    </div>
  );
};

export default SingleUpload;
