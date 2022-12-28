/* eslint-disable consistent-return */
import { ScUpload } from '@scboson/sc-element';
import { UploadFile } from '@scboson/sc-element/es/sc-upload';
import { UploadListType } from 'antd/es/upload/interface';
import React, { useLayoutEffect, useState } from 'react';
import { imageUrl } from '../../../utils/common';
import { FileType, uploadBtn } from './index';
import { getFileName, isMultimedia } from './utils';

interface MultipleUpload {
  action?: string;
  value?: any[];
  onChange?: (value: any[]) => void;
  maxFiles?: number; // 最多上传几个配合 mode 类型为 multiple
  disabled?: boolean; // 是否禁用
  maxSize?: number; // 上传文件大小
  maxSizeCheck: (file: any) => boolean;
  beforeUpload?: (file: any, fileList: any) => boolean | Promise<any>;
  accept?: string;
  headers?: any;
  valeFormat?: (data: any) => Promise<string | FileType | null>;
  listType?: UploadListType;
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
    listType = 'picture-card',
    maxFiles = 999,
    ...restProps
  } = props;

  const getItemFileName = (url: string, name: string) => {
    if (listType === 'picture') {
      return name;
    }
    return isMultimedia(url) ? '' : name;
  };

  const formatList = (_fileList: any) => {
    let newfileList = JSON.parse(JSON.stringify(_fileList));
    if (Array.isArray(newfileList) && newfileList.length > 0) {
      newfileList = newfileList
        .map((item, index) => {
          if (typeof item === 'string') {
            return {
              uid: index + '',
              url: imageUrl(item),
              fileUrl: item,
              status: 'done',
              name: getItemFileName(imageUrl(item) || '', getFileName(item)),
            };
          } else {
            return {
              uid: index + '',
              url: imageUrl(item.url),
              fileUrl: item.url,
              fileInfoId: item.fileId || item.fileInfoId,
              thumbnailUrl: item.thumb_url || item.thumbnailUrl,
              name: getItemFileName(
                imageUrl(item.url) || '',
                getFileName(item.fileName)
              ),
              status: 'done',
            };
          }
        })
        .filter((item) => item !== null);
    } else {
      newfileList = [];
    }
    return newfileList;
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useLayoutEffect(() => {
    //&& fileList.length === 0不
    if (Array.isArray(value)) {
      if (value.length === 0) {
        setFileList([])
      } else {
        setFileList(formatList(value));
      }

    }
  }, [JSON.stringify(value)]);

  const fileFormatObjet: any = (file: any, index: number) => {
    let result: any = file;
    if (file.response && file.response.success) {
      result = file.response.data;
      return {
        uid: result.fileInfoId + index,
        name: result.fileName,
        url: imageUrl(result.fileUrl || ''),
        thumbUrl: imageUrl(result.thumbnailUrl),
        thumbnailUrl: result.thumbnailUrl,
        fileUrl: result.fileUrl,
        status: 'done',
      };
    } else {
      return result;
    }
  };

  const handleChange = async ({
    fileList: list,
  }: {
    fileList: UploadFile[];
  }) => {
    if (list.length === 0) {
      onChange?.([]);
      setFileList([]);
      return;
    }

    const _fileList = list.map((it: any) => {
      if (
        it.status === 'done' &&
        it.response &&
        !Boolean(it.response.success)
      ) {
        return {
          ...it,
          status: 'error',
          url: null,
          thumbUrl: null,
        };
      }
      return it;
    });

    const rfileList = _fileList.filter((item) => {
      if (item.status === 'done') {
        return true;
      } else {
        if (item.size && item.type) {
          return maxSizeCheck(item);
        }
        return true;
      }
    });

    const doneList = _fileList.filter((it) => it.status === 'done');

    if (doneList.length === _fileList.length) {
      const outList: any[] = [];
      for (let i = 0; i < _fileList.length; i++) {
        const file = _fileList[i];
        if (file.status === 'done') {
          let result: any = file;
          if (file.response && file.response.success) {
            result = file.response.data;
          }
          if (valeFormat && result) {
            // if (typeof result === 'string') {
            //   setPreviewImage(result);
            //   setPreviewImage(resultData.fileName);
            // } else {
            //   setPreviewName(result && result.fileName ? result.fileName : null);
            //   setPreviewImage(result && result.url ? result.url : null);
            // }
            console.log(result);
            result = await valeFormat(result);
            outList.push(result);
          } else {
            outList.push(result);
          }
        }
      }
      setFileList(doneList.map((it, index) => fileFormatObjet(it, index)));
      onChange?.(outList);
    } else {
      setFileList(rfileList);
    }
  };

  return (
    <ScUpload
      action={action}
      listType={listType}
      fileList={fileList}
      onChange={handleChange}
      accept={accept}
      beforeUpload={beforeUpload}
      headers={headers}
      {...restProps}
      maxCount={maxFiles}
      multiple
    >
      {fileList.length >= maxFiles ? null : uploadBtn(listType)}
    </ScUpload>
  );
};

export default MultipleUpload;
