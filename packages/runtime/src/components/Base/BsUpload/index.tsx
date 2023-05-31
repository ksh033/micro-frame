import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  FormComponent,
  FormComponentProps,
} from "@scboson/sc-element/es/c-form";
import { Button, message } from "antd";
import { UploadListType } from "antd/es/upload/interface";
import React from "react";
import { baseApi, imageUrl } from "../../../utils/common";
import compute from "../../../utils/compute";
import { getUser } from "../../Auth";
import MultipleUpload from "./MultipleUpload";
import SingleUpload from "./SingleUpload";
import { isImageFileType } from "./utils";
import ViewItem from "./ViewItem";

export type FileType = {
  url: string | null;
  width?: number;
  height?: number;
  fileId: string;
  thumb_url?: string;
  fileName: string;
};

interface BsUploadProps extends FormComponentProps {
  action?: string;
  value?: (FileType | string) | (FileType | string)[];
  onChange?: (value: any[]) => void;
  maxFiles?: number; // 最多上传几个配合 mode 类型为 multiple
  mode?: "multiple" | "single"; // single 上传一个 |  multiple 上传多个配合maxFiles使用
  disabled?: boolean; // 是否禁用
  maxSize?: number; // 上传文件大小
  videoMaxSize?: number; // 视频的文件大小
  uploadImmediately?: boolean; // 是否立即上传
  accept?: string; // 图片上传类型
  warnContent?: React.ReactNode | string;
  imgWidth?: { maxWidth?: number; minWidth?: number; width?: number };
  imgHeight?: { maxHeight?: number; minHeight?: number; height?: number };
  valueType?: "string" | "object";
  listType?: UploadListType;
}

export const uploadBtn = (listType: UploadListType) => {
  if (listType === "picture-card") {
    return (
      <div>
        <PlusOutlined />
        <div>上传</div>
      </div>
    );
  }
  if (listType === "picture") {
    return <Button icon={<UploadOutlined />}>上传</Button>;
  }
  return null;
};

const BsUpload: FormComponent<BsUploadProps> = (props: BsUploadProps) => {
  const {
    maxFiles = 999,
    mode = "single",
    disabled = false,
    maxSize = 3 * 1024 * 1024,
    videoMaxSize = 8 * 1024 * 1024,
    action = `${baseApi}/file/api/file/upload`,
    uploadImmediately = true,
    accept = "image/*",
    warnContent,
    readonly,
    imgWidth = undefined,
    imgHeight = undefined,
    initialValues,
    valueType = "string",
    listType: propListType = "picture-card",
    name,
    ...restProps
  } = props;
  const user = getUser();
  const headers: any = { "app-version": "1.0" };
  if (user) {
    headers.token = user.token;
    headers["sys-code"] = user.userAppInfo.currentSystem?.systemCode;
  } else {
    headers["sys-code"] = "common";
  }
  const listType = propListType === "text" ? "picture-card" : propListType;

  const maxSizeM = compute.divide(maxSize, 1024 * 1024);
  const videoMaxSizeM = compute.divide(videoMaxSize, 1024 * 1024);

  const maxSizeCheck = (file: any) => {
    const isImg = isImageFileType(file.type);
    if (isImg) {
      return file.size <= maxSize;
    }
    const isVideo = file.type.indexOf("video") > -1;
    if (isVideo) {
      return file.size <= videoMaxSize;
    }

    return file.size <= maxSize;
  };
  const loadImg = (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        // 当 FileReader 读取文件时候，读取的结果会放在 FileReader.result 属性中
        var imgObj = new Image();
        // @ts-ignore
        imgObj.src = reader.result;
        imgObj.onload = function () {
          resolve({ width: imgObj.width, height: imgObj.height });
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const beforeUpload = async (file: any) => {
    if (file.type.indexOf("image") > -1) {
      const size: any = await loadImg(file);

      if (imgWidth || imgHeight) {
        if (imgHeight) {
          const { minHeight, maxHeight, height } = imgHeight;
          if (minHeight && maxHeight) {
            if (!(size.height < maxHeight && size.height > minHeight)) {
              message.error(`图片高度必须${minHeight}-${maxHeight}!`);
              return false;
            }
          } else if (minHeight) {
            if (size.height < minHeight) {
              message.error(`图片高度必须大于${minHeight}!`);
              return false;
            }
          } else if (maxHeight) {
            if (size.height > maxHeight) {
              message.error(`图片高度不超过${maxHeight}!`);
              return false;
            }
          } else if (height) {
            if (size.height != height) {
              message.error(`图片高度必须${height}!`);
              return false;
            }
          }
        }
        if (imgWidth) {
          const { minWidth, maxWidth, width } = imgWidth;
          if (maxWidth && minWidth) {
            if (!(size.height < maxWidth && size.height > minWidth)) {
              message.error(`图片宽度必须${minWidth}-${maxWidth}!`);
              return false;
            }
          } else if (minWidth) {
            if (size.width < minWidth) {
              message.error(`图片宽度必须大于${minWidth}!`);
              return false;
            }
          } else if (maxWidth) {
            if (size.width > maxWidth) {
              message.error(`图片宽度不超过${maxWidth}!`);
              return false;
            }
          } else if (width) {
            if (size.width != width) {
              message.error(`图片宽度必须${width}!`);
              return false;
            }
          }
        }
      }
      const isJpgOrPng = file.type && file.type.indexOf("image") > -1;
      const isLt2M = file.size <= maxSize;
      // 判断是否有url 如果有就立即上传，没有就不上传，而是改为手动提交
      if (!isJpgOrPng) {
        message.error("请上传JPG/PNG的图片格式");
        return false;
      }

      if (!isLt2M) {
        message.error(`图片大小必须小于${maxSizeM}M!`);
        return false;
      }
      if (uploadImmediately) {
        return isJpgOrPng && isLt2M;
      } else {
        return false;
      }
    }
    if (file.type.indexOf("video") > -1) {
      const isJpgOrPng = file.type && file.type.indexOf("video") > -1;
      const isLt2M = file.size <= videoMaxSize;
      // 判断是否有url 如果有就立即上传，没有就不上传，而是改为手动提交
      if (!isJpgOrPng) {
        message.error("请上传视频");
        return false;
      }
      if (!isLt2M) {
        message.error(`视频大小必须小于${videoMaxSizeM}M!`);
        return false;
      }
      if (uploadImmediately) {
        return isJpgOrPng;
      } else {
        return false;
      }
    }
    const isLt2M = file.size <= maxSize;

    if (!isLt2M) {
      message.error(`文件大小必须小于${maxSizeM}M!`);
      return false;
    }

    if (uploadImmediately) {
      return isLt2M;
    } else {
      return false;
    }
  };

  const checkImgWidth = (fileUrl: string | null) => {
    return new Promise((resolve, reject) => {
      const newUrl = imageUrl(fileUrl || "");
      if (newUrl) {
        const img = new Image();
        img.src = newUrl;
        img.onload = function () {
          resolve({
            width: img.width,
            height: img.height,
          });
        };
      } else {
        reject("图片地址不存在");
      }
    });
  };

  const valeFormat = async (result: any): Promise<string | FileType | null> => {
    try {
      let fileUrl: string | null = null;
      if (result && result.fileUrl) {
        fileUrl = result.fileUrl;
      }
      if (valueType === "string") {
        return fileUrl;
      } else {
        if (result.type?.indexOf("image/") === 0) {
          if (result.width && result.height) {
            return {
              fileId: result.fileInfoId,
              fileName: result.fileName,
              url: fileUrl ? fileUrl : null,
              width: result.width,
              height: result.height,
              thumb_url: result.thumbnailUrl,
            };
          } else {
            const imgInfo: any = await checkImgWidth(fileUrl);
            return {
              fileId: result.fileInfoId,
              fileName: result.fileName,
              url: fileUrl ? fileUrl : null,
              width: imgInfo && imgInfo.width ? imgInfo.width : null,
              height: imgInfo && imgInfo.height ? imgInfo.height : null,
              thumb_url: result.thumbnailUrl,
            };
          }
        }
        return {
          fileId: result.fileInfoId,
          fileName: result.fileName,
          url: fileUrl ? fileUrl : null,
          thumb_url: result.thumbnailUrl,
        };
      }
    } catch (error) {
      return null;
    }
  };

  if (readonly) {
    if (restProps.value) {
      return (
        <ViewItem
          files={
            Array.isArray(restProps.value) ? restProps.value : [restProps.value]
          }
          listType={listType}
        ></ViewItem>
      );
    }
    return null;
  }

  return (
    <div>
      {mode === "single" ? (
        <SingleUpload
          disabled={disabled}
          maxSize={maxSize}
          action={action}
          uploadImmediately={uploadImmediately}
          beforeUpload={beforeUpload}
          accept={accept}
          headers={headers}
          valeFormat={valeFormat}
          maxSizeCheck={maxSizeCheck}
          listType={listType}
          {...restProps}
        ></SingleUpload>
      ) : (
        <MultipleUpload
          disabled={disabled}
          maxSize={maxSize}
          maxFiles={maxFiles}
          action={action}
          beforeUpload={beforeUpload}
          accept={accept}
          headers={headers}
          valeFormat={valeFormat}
          maxSizeCheck={maxSizeCheck}
          listType={listType}
          {...restProps}
          value={Array.isArray(props.value) ? props.value : []}
        ></MultipleUpload>
      )}
      {warnContent || null}
    </div>
  );
};

BsUpload.customView = true;
export default BsUpload;
