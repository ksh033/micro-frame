import React, { useMemo } from 'react';
import { Alert, Form, Input } from 'antd';
import { CModal } from '@scboson/sc-element';
import type { DialogOptions } from '@scboson/sc-schema/es/interface';
import type { Result as BaseResult } from '@scboson/sc-schema/es/event/BindEventUtil';
import ModalPageContainer from '../../../components/Base/Tpl/ModalPageTpl';

const { TextArea } = Input;
type InvalidProps = {
  close: () => void;
  pageProps: {
    request: BaseResult<any, [params?: any, options?: any]>; // 请求数据的远程方法
    rowData: any;
    rowKey: string;
    reload?: () => void;
    errorClose?: boolean;
    extraMessage?: string;
  };
};

const Invalid: React.FC<InvalidProps> = (props) => {
  const { pageProps, close } = props;
  const [form] = Form.useForm();

  const {
    request,
    rowData,
    rowKey,
    reload,
    errorClose = false,
    extraMessage,
  } = pageProps;
  const { runAsync: run, loading } = request;

  const initialValues = useMemo(() => {
    return {
      [`${rowKey}`]: rowData[`${rowKey}`],
    };
  }, [rowData, rowKey]);

  const modalButtons = [
    {
      text: '取消',
      onClick: () => {
        close?.();
      },
    },
    {
      text: '确定',
      type: 'primary',
      loading,
      onClick: () => {
        form.validateFields().then((values) => {
          if (errorClose) {
            run(values)
              .then(() => {
                reload?.();
                close?.();
              })
              .catch(() => {
                reload?.();
                close?.();
              });
          } else {
            run(values).then(() => {
              reload?.();
              close?.();
            });
          }
        });
      },
    },
  ];

  return (
    <ModalPageContainer toolbar={modalButtons}>
      {extraMessage ? <Alert message={extraMessage} type="warning" /> : null}
      <Form form={form} initialValues={initialValues} layout="vertical">
        <Form.Item label="id" name={rowKey} hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="请在下方输入作废原因"
          name="canceledMsg"
          rules={[{ required: true, message: '请在下方输入作废原因' }]}
        >
          <TextArea placeholder="请输入" />
        </Form.Item>
      </Form>
    </ModalPageContainer>
  );
};

export function openInvalid(newOptions: DialogOptions) {
  CModal.show({
    title: '作废提示',
    showFull: false,
    okCancel: false,
    footer: null,
    width: 400,
    ...newOptions,
    content: Invalid,
  });
}

export default Invalid;
