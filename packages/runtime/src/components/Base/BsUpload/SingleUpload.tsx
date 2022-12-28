/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable consistent-return */
import {
  DeleteOutlined,
  EyeOutlined,
  FileOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, message, Space, Spin, Upload } from 'antd';
import { UploadFile, UploadListType } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';
import { imageUrl } from '../../../utils/common';
import { FileType, uploadBtn } from './index';
import styles from './index.less';
import { getFileName } from './utils';

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
  listType?: UploadListType;
}

export const preView = (_file: UploadFile<any>) => {
  if (_file != null) {
    const file = imageUrl(_file?.url || '');
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
          <video controls className="bs-upload-video">
            <source src={file} type="video/mp4" />
          </video>
        );
      }
      return (
        <Space direction="vertical">
          <FileOutlined
            style={{ width: '100%', color: '#40a9ff', fontSize: '32px' }}
          />
          <span>{_file.name}</span>
        </Space>
      );
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
    listType = 'picture-card',
  } = props;

  const [file, setFile] = useState<UploadFile | undefined>(void 0);
  const [loading, setLoading] = useState<boolean>(false);

  const fileFormat = (itfile: any) => {
    if (!itfile) {
      setFile(void 0)

    } else {
      if (typeof itfile === 'string') {
        setFile({
          uid: '1',
          url: imageUrl(itfile) || '',
          status: 'done',
          name: getFileName(itfile),
        });
      } else {
        setFile({
          uid: '1',
          url: imageUrl(itfile.url || itfile.fileUrl) || '',
          name: itfile.fileName || '',
          status: 'done',
        });
      }
    }

  };

  useEffect(() => {
    // && file == null
    //if (value != null) {
    fileFormat(value);
    //}
  }, [JSON.stringify(value)]);

  const handleChange = async ({ file }: any) => {
    if (file.status === 'removed') {
      setFile(void 0);
      onChange?.(null);
      return;
    }
    if (!maxSizeCheck(file)) {
      return;
    }
    if (
      file.status === 'done' &&
      file.response &&
      !Boolean(file.response.success)
    ) {
      message.error('上传失败');
      setFile(void 0);
      setLoading(false);
      return;
    }

    if (uploadImmediately) {
      if (file.status === 'uploading') {
        setFile(file);
        setLoading(true);
        return;
      }
      setLoading(false);
      if (file.status === 'done') {
        // handlePreview(file);
        let result = file;
        let resultData = file;
        if (file.response && file.response.success) {
          result = file.response.data;
          resultData = file.response.data;
        }
        if (valeFormat) {
          result = await valeFormat(result);
        }
        fileFormat(resultData);
        onChange && onChange(result);
      } else {
        setFile(file);
      }
    } else {
      setFile(file);
      onChange && onChange(file);
    }
  };

  const uploadExtraProps: any = { showUploadList: false };

  if (action) {
    uploadExtraProps.action = action;
  }

  if (listType === 'picture') {
    uploadExtraProps.fileList = file != null ? [file] : [];
    uploadExtraProps.className = 'upload-list-inline';
    uploadExtraProps.showUploadList = true;
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
  const previewIcon = (
    <Button type="text" size="small" className="anticon-delete">
      <a
        target="_blank"
        rel="noopener noreferrer"
        title="预览文件"
        href={file?.url || ''}
      >
        <EyeOutlined />
      </a>
    </Button>
  );

  const removeIcon = (
    <Button
      type="text"
      size="small"
      className="anticon-delete"
      onClick={() => {
        setFile(void 0);
        onChange?.(null);
      }}
    >
      <span>
        <DeleteOutlined />
      </span>
    </Button>
  );

  const iconRender = (file: UploadFile<any>) => {
    if (!file) {
      return null
    }
    if (file.status === 'uploading') {
      return (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      );
    }
    return (
      <div className="bs-signle-picture-card">
        <div className="bs-signle-picture-card-info">
          <div className=" bs-signle-upload-span">{preView(file)}</div>
          <span className="bs-signle-upload-actions">
            {previewIcon}
            {removeIcon}
          </span>
        </div>
      </div>
    );
  };

  const showRender = (itfile: UploadFile<any>) => {
    if (listType === 'picture') {
      return null;
    }
    return iconRender(itfile);
  };

  return (
    <div className="bs-signle-img clearfix">
      <Upload
        onChange={handleChange}
        listType={listType}
        beforeUpload={beforeUpload}
        disabled={disabled}
        openFileDialogOnClick={file == null}
        accept={accept}
        headers={headers}
        {...uploadExtraProps}
      >
        {file == null ? uploadBtn(listType) : showRender(file)}
        {/* <div className="bs-signle-picture-card">
          {file != null ? (
            <UploadList
              locale={{ previewFile: '预览图片', removeFile: '删除图片' }}
              showDownloadIcon={false}
              listType={listType}
              iconRender={iconRender}
              onRemove={(file: any) => {
                console.log(file);
                setFile(void 0);
                onChange?.(null);
              }}
              items={[file]}
            />
          ) : (
            uploadBtn(listType)
          )}
        </div> */}
      </Upload>
    </div>
  );
};

export default SingleUpload;
