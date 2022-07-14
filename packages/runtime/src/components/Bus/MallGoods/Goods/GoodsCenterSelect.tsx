/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useMemo, useRef, useState } from 'react';

import type { FormComponent } from '@scboson/sc-element/es/c-form';
import { CModalDialogProps } from '@scboson/sc-element/es/c-modal';
import ActionButton from '@scboson/sc-element/es/c-modal/ActionButton';
import { ScCard } from '@scboson/sc-layout';
import type { ProColumn } from '@scboson/sc-schema/es/interface';
import type TableInfo from '@scboson/sc-schema/lib/page/TableInfo';
import { useSessionStorageState } from 'ahooks';
import { Button, Modal } from 'antd';
import { ButtonProps } from 'antd/es/button/button';
import AuthButton from '../../../Auth/AuthButton';
import BsTable from '../../../Base/BsTable';
import GoodsCatalogTree from '../../../Bus/MallGoods/Catalog/CatalogTree';
import {
  WithSelectTable,
  WithSelectTableProps,
  WithTableProps,
} from '../../../WithComponent';
import GoodsCenterTable from './GoodsCenterTable';

export type GoodsTransferProps = WithSelectTableProps &
  WithTableProps & {
    extraColumns?: ProColumn[];
    request?: (params: any) => Promise<any>; // 请求数据的远程方法
    params?: any;
    rowKey?: string;
    onSubmitGoods?: (
      goodsList: { goodsId: string; goodsName: string; [key: string]: any }[],
      buttonIndex?: string,
      clearRows?: () => void
    ) => void;
    tableProps?: any;
    buttonProps?: ButtonProps & { text: string };
    modalProps?: CModalDialogProps;
    header?: React.ReactNode;
    viewUrl?: string;
    customRef?: React.RefObject<any>;
    preHandle?: () => any;
    formatTableInfo?: (tableInfo: TableInfo) => TableInfo;
  };

const DlgContent = (porps: GoodsTransferProps) => {
  const [rightSelectedRows, setRightSelectRows] = useState<any[]>();
  const {
    selectionType,
    extraColumns,
    request,
    rowKey = 'goodsId',
    params,
    onTabelRow,
    header,
    customRef,
    viewUrl,
    getCheckboxProps,
    autoload = true,
    formatTableInfo,
  } = porps;
  const [cacheCatalogId] = useSessionStorageState<string>(
    `${window.location.pathname}_selectedKeys`,
    ''
  );
  const [catalogId, setCatalogId] = useState<string>(cacheCatalogId);
  const tableParams = useMemo(() => {
    let newPrams = {
      catalogId,
      ...params,
    };
    return newPrams;
  }, [catalogId, JSON.stringify(params)]);

  const clearSelectRow = () => {
    setRightSelectRows([]);
    onTabelRow && onTabelRow([], []);
  };
  if (customRef !== null && customRef !== undefined) {
    if (typeof customRef === 'object') {
      customRef.current.clearSelectRow = clearSelectRow;
    }
  }

  return (
    <>
      {header}
      <ScCard
        bodyStyle={{
          margin: '0px',
          padding: '0px',
          maxWidth: '1150px',
          height: '580px',
          overflow: 'hidden',
        }}
        gutter={4}
      >
        <ScCard
          colSpan="170px"
          // style={{ height: '100%' }}
          bodyStyle={{ padding: '0px', overflow: 'auto' }}
        >
          <GoodsCatalogTree
            height={490}
            cache={false}
            selectedKeys={[catalogId]}
            onSelect={(selectedKeys) => {
              let [key] = selectedKeys;
              if (key) {
                if (key == '0') {
                  key = '';
                } else {
                  key = key + '';
                }
                setCatalogId(key);
              } else {
                setCatalogId('');
              }
            }}
            loadedKeys={[]}
            autoload={false}
          />
        </ScCard>
        <ScCard bodyStyle={{ padding: '0px' }} style={{ height: '100%' }}>
          <GoodsCenterTable
            size="small"
            params={tableParams}
            selectionType={selectionType}
            selectedRows={rightSelectedRows}
            extraColumns={extraColumns}
            onTabelRow={(keys, rows) => {
              onTabelRow && onTabelRow(keys, rows);
              setRightSelectRows(rows);
            }}
            viewUrl={viewUrl}
            getCheckboxProps={getCheckboxProps}
            rowKey={rowKey}
            request={request}
            autoload={autoload}
            formatTableInfo={formatTableInfo}
          ></GoodsCenterTable>
        </ScCard>
        <ScCard
          colSpan="280px"
          style={{ height: '100%' }}
          bodyStyle={{ padding: '0px' }}
        >
          <BsTable
            rowKey={rowKey}
            scroll={{ y: 420, x: '100%' }}
            pagination={false}
            title={() => {
              return <div style={{ marginTop: '10px' }}>已选商品</div>;
            }}
            dataSource={rightSelectedRows}
            size="small"
            columns={[
              {
                title: '商品',
                dataIndex: 'goodsName',
                width: 160,
              },
              {
                title: '操作',
                width: 60,
                render: (v, record) => {
                  const id = record[rowKey];
                  return (
                    <Button
                      type="link"
                      onClick={() => {
                        const rows = rightSelectedRows
                          ? rightSelectedRows?.filter(
                              (item: any) => item[rowKey] != id
                            )
                          : [];
                        setRightSelectRows(rows);
                        const keys = rows
                          ? rows?.map((item: any) => item[rowKey])
                          : [];
                        onTabelRow && onTabelRow(keys, rows);
                      }}
                    >
                      删除
                    </Button>
                  );
                },
              },
            ]}
          ></BsTable>
        </ScCard>
      </ScCard>
    </>
  );
};
/**
 * 通用商品选择,请求req外部定义
 *
 * @param props
 * @returns
 */
const GoodsCenterSelect: React.FC<GoodsTransferProps> = (props) => {
  const {
    onOk,
    onSubmitGoods,
    buttonProps = { text: '新增', type: 'primary' },
    modalProps,
    preHandle,
    ...restProps
  } = props;
  const { text, ...otherProps } = buttonProps;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const ref = useRef<any>({});
  //const {customToolbar,...restModalProps}=modalProps;

  const customOnOk = (buttonIndex?: string) => {
    const selectData = onOk && onOk();
    let result =
      onSubmitGoods &&
      onSubmitGoods(selectData, buttonIndex, ref?.current?.clearSelectRow);
    return result;
  };

  const close = () => {
    ref?.current?.clearSelectRow();
    setIsModalVisible(false);
  };

  const toolbar: any = modalProps?.customToolbar
    ? modalProps?.customToolbar.map(({ onClick, ...restProps }, index) => {
        return (
          <ActionButton
            key={`extra-btn-${index}`}
            actionFn={() => {
              onClick && onClick();
              return customOnOk('button' + index);
            }}
            closeModal={close}
            buttonProps={restProps.buttonProps}
          >
            {restProps.text}
          </ActionButton>
        );
      })
    : [];

  const showDlg = async () => {
    const reval = preHandle ? await preHandle() : true;
    if (reval) {
      setIsModalVisible(true);
      // CModal.show({
      //   title: '选择商品',
      //   content: Dlg,
      //   onOk: () => {
      //     return customOnOk();
      //   },
      //   ...modalProps,
      //   customToolbar: toolbar,
      // });
    }
  };

  return (
    <div>
      <AuthButton onClick={showDlg} {...otherProps}>
        {text}
      </AuthButton>
      <Modal
        title="选择商品"
        visible={isModalVisible}
        onCancel={close}
        width={1200}
        onOk={() => {
          return customOnOk();
        }}
        footer={[
          <Button key="back" onClick={close}>
            取消
          </Button>,
          <ActionButton
            key="submit"
            actionFn={() => {
              return customOnOk();
            }}
            closeModal={close}
            buttonProps={modalProps?.okButtonProps || { type: 'primary' }}
          >
            {modalProps?.okText || '确定'}
          </ActionButton>,
          ...toolbar,
        ]}
      >
        <DlgContent {...restProps} customRef={ref} />
      </Modal>
    </div>
  );
};

/** 商品弹出窗口选择 */

const GoodModalSelect: FormComponent<GoodsTransferProps> =
  WithSelectTable<GoodsTransferProps>(GoodsCenterSelect, true, {
    normalize: (data: any[]) => {
      if (data)
        return data.map(({ goodsId, deptGoodsId, goodsName, dataId }) => ({
          goodsId,
          deptGoodsId,
          dataId,
          goodsName,
        }));
      return [];
    },
    getValueProps: (data: any[]) => {
      if (data)
        return data.map(({ goodsId, deptGoodsId, goodsName, dataId }) => ({
          goodsId,
          deptGoodsId,
          dataId,
          goodsName,
        }));
      return [];
    },
  });
export default GoodModalSelect;
