/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { Upload, message, Button, Modal } from 'antd';
import {
  PlusOutlined,
  LoadingOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
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
  onChange?: (value: any) => void;
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

export const preView = (_file: string, isModal) => {
  if (_file) {
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
            <video
              controls
              autoPlay
              className={
                isModal
                  ? styles['bs-upload-modal-video']
                  : styles['bs-upload-video']
              }
            >
              <source src={file} type="video/mp4" />
            </video>
          );
        }
      }
      return null;
    }
  }
  return null;
};

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
  const [visible, setVisible] = useState<boolean>(false);

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
    if (
      file.status === 'done' &&
      file.response &&
      !Boolean(file.response.success)
    ) {
      message.error('上传失败');
      setLoading(false);
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

  const uploadExtraProps: any = {};

  if (action) {
    uploadExtraProps.action = action;
  }

  const uploadButton = loading ? (
    <>
      <LoadingOutlined />
      <div style={{ marginTop: 8 }}>上传中</div>
    </>
  ) : (
    <>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </>
  );
  const previewStyle: React.CSSProperties = {
    pointerEvents: 'none',
    opacity: 0.5,
  };
  const previewIcon = (
    <Button
      type="text"
      size="small"
      className="anticon-delete"
      onClick={() => setVisible(true)}
    >
      <EyeOutlined />
    </Button>
  );

  const removeIcon = (
    <Button
      type="text"
      size="small"
      className="anticon-delete"
      onClick={() => {
        onChange?.(null);
      }}
    >
      <span>
        <DeleteOutlined />
      </span>
    </Button>
  );

  return (
    <div className="bs-signle-img clearfix">
      <Upload
        listType="picture-card"
        showUploadList={false}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        disabled={disabled}
        openFileDialogOnClick={previewImage == null}
        accept={accept}
        headers={headers}
        {...uploadExtraProps}
      >
        <div className="bs-signle-picture-card">
          {previewImage ? (
            <div className="bs-signle-picture-card-info">
              <div className=" bs-signle-upload-span">
                {preView(previewImage, false)}
              </div>
              <span className="bs-signle-upload-actions">
                {previewIcon}
                {removeIcon}
              </span>
            </div>
          ) : (
            uploadButton
          )}
        </div>
      </Upload>
      <Modal
        visible={visible}
        footer={null}
        width={400}
        onCancel={() => setVisible(false)}
        bodyStyle={{ padding: 0 }}
      >
        {preView(previewImage, true)}
      </Modal>
    </div>
  );
};

export default SingleUpload;
