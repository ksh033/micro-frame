/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yangyuhang
 * @Date: 2022-06-20 10:58:33
 * @LastEditors: yangyuhang
 * @LastEditTime: 2023-04-12 18:20:25
 */
import React, { useState, useMemo, useEffect } from 'react';
import { Switch } from 'antd';
import { BsTableComponentProps } from '../../Base/BsTable';
import { SwitchChangeEventHandler } from 'antd/es/switch';
import { useRequest } from 'ahooks';
import { CModal } from '@scboson/sc-element';
import Authority from '../../Auth/Authority';

type EnabledProps = BsTableComponentProps & {
  request: (params: any) => Promise<any>; // 请求数据的远程方法
  rowKeyName?: string;
  warning?: string;
  openWarning?: string;
  enabledName?: string;
  funcode?: string;
  disabled?: boolean;
  disabledCallback?: (rowData: any) => boolean;
  callback?: (res: any) => void;
};

const Enabled: React.FC<EnabledProps> = (props) => {
  const {
    request,
    rowKeyName = 'id',
    value,
    rowData,
    warning = '您是否确定禁用?',
    openWarning,
    enabledName = 'enabled',
    disabled,
    callback,
    disabledCallback,
  } = props;
  const { loading, run } = useRequest(request, {
    manual: true,
  });
  const [state, setState] = useState<boolean>(!!value);

  useEffect(() => {
    setState(value);
  }, [value]);

  const handleChange: SwitchChangeEventHandler = (checked: boolean) => {
    if (checked === false) {
      CModal.confirm({
        title: `${warning}`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          return run({
            [rowKeyName]: rowData[rowKeyName],
            [enabledName]: checked,
          }).then((data) => {
            setState(checked);
            rowData[enabledName] = checked;
            callback?.(true);
            return true;
          });
        },
      });
    } else {
      if (openWarning) {
        CModal.confirm({
          title: `${openWarning}`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            return run({
              [rowKeyName]: rowData[rowKeyName],
              [enabledName]: checked,
            }).then((data) => {
              setState(checked);
              rowData[enabledName] = checked;
              callback?.(true);
              return true;
            });
          },
        });
      } else {
        run({
          [rowKeyName]: rowData[rowKeyName],
          [enabledName]: checked,
        }).then(() => {
          setState(checked);
          rowData[enabledName] = checked;
          callback?.(true);
        });
      }
    }
  };

  let backDisabled: any = useMemo(() => {
    let rbackDisabled = false;
    if (disabled !== undefined && disabled !== null) {
      rbackDisabled = disabled;
    }
    if (typeof disabledCallback === 'function') {
      rbackDisabled = disabledCallback(rowData);
    }

    return rbackDisabled;
  }, [JSON.stringify(rowData), disabled, disabledCallback]);

  if (disabled !== undefined || disabled !== null) {
  }
  return (
    <Switch
      checkedChildren="启用"
      unCheckedChildren="禁用"
      checked={state}
      onChange={handleChange}
      loading={loading}
      disabled={backDisabled}
    />
  );
};

export default Authority(Enabled, 'Enabled');
