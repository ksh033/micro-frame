import { CModal } from "@scboson/sc-element";
import { Button } from "antd";
import type { FC } from "react";
import { print } from "../../../utils/print";

type PrintConfirmPageProps = {
  moduleId: string;
  isZhen?: boolean;
  title?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  params?: any;
  callback?: () => void;
};

type PrintConfirmProps = {
  close: () => void;
  pageProps: PrintConfirmPageProps;
};

const PrintConfirm: FC<PrintConfirmProps> = (props) => {
  const { close, pageProps } = props;
  const {
    title = "请选择是否打印出库单",
    content,
    okText = "确认打印",
    cancelText = "暂不打印",
    isZhen = false,
    callback,
    moduleId,
    params,
  } = pageProps;

  const onPrint = async (zhen: boolean) => {
    let newModuleId = moduleId;
    if (zhen) {
      newModuleId = newModuleId + "1";
    }

    const result = await print(newModuleId, {
      params: params,
    });
    if (result) {
      close?.();
      callback?.();
    }
  };

  const onClose = () => {
    close?.();
    callback?.();
  };

  return (
    <div className="ant-modal-confirm">
      <div
        className="ant-modal-confirm-confirm ant-modal-confirm-body-wrapper"
        style={{ padding: "32px 32px 24px" }}
      >
        <div className="ant-modal-confirm-body">
          <span
            role="img"
            aria-label="exclamation-circle"
            className="anticon anticon-exclamation-circle"
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="exclamation-circle"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
              <path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
            </svg>
          </span>
          {title === undefined ? null : (
            <span className={`ant-modal-confirm-title`}>{title}</span>
          )}
          <div className={`ant-modal-confirm-content`}>{content}</div>
        </div>
        <div className="ant-modal-confirm-btns">
          <Button onClick={onClose}>{cancelText}</Button>
          {isZhen ? (
            <Button
              type="primary"
              onClick={() => {
                onPrint(false);
              }}
            >
              A4打印
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                onPrint(false);
              }}
            >
              {okText}
            </Button>
          )}
          {isZhen ? (
            <Button
              type="primary"
              onClick={() => {
                onPrint(true);
              }}
            >
              针式打印
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const openPrintConfirm = (pageProps: PrintConfirmPageProps) => {
  CModal.show({
    width: "420px",
    style: {
      minWidth: "420px",
      verticalAlign: "top",
      top: "100px",
    },
    content: PrintConfirm,
    okCancel: false,
    footer: null,
    closable: false,
    pageProps: pageProps,
  });
};

export default PrintConfirm;
