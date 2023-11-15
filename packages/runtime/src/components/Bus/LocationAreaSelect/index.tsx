/* eslint-disable max-len */

import { CModal, ScSelect } from '@scboson/sc-element';
import {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form';
import type { ScSelectProps } from '@scboson/sc-element/es/sc-select';
import { useUpdateEffect } from 'ahooks';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useState } from 'react';
import { uesRequest } from '../../../utils/api';
import { getUser } from '../../Auth';
import userLocationarea from '../../Dict/userLocationarea';

type LocationAreaSelectProps = FormComponentProps &
  ScSelectProps & {
    filterData?: (list: any[]) => any[];
    extProps?: (record) => LocationAreaSelectProps;
    rowData?: any;
    needWarned?: boolean;
    changeWarngingMsg?: string;
    hasDisable?: boolean; // 是否要查询未启用的
    hasDefectiveArea?: boolean; // 是否残次
    hasYdc?: boolean; // 是否预订菜
    local?: boolean;
  };

const LocationAreaSelect: FormComponent<LocationAreaSelectProps> = (props) => {
  const { run } = uesRequest('system', 'locationAreaList');
  const { locationareaList } = userLocationarea();
  const {
    readonly,
    initialValues,
    filterData,
    extProps,
    rowData,
    onChange,
    needWarned = false,
    hasDisable = false,
    hasDefectiveArea = false,
    params = {},
    hasYdc = false,
    changeWarngingMsg,
    local = false,
    autoload = true,
    defaultValue,
    ...resProps
  } = props;

  const [dataSource, setDataSource] = useState<any[]>([]);
  const record = props['data-row'] || props.rowData || initialValues || {};

  const user = getUser();
  const bizDeptType = user?.userAppInfo?.currentDept.bizDeptType;

  const defaultWaringMsg = `切换${
    bizDeptType === 'SHOP' ? '档口' : '库区'
  }后,下方商品明细将被清空，是否确定切换`;

  const loadData = () => {
    run({
      ...params,
      hasDefectiveArea: hasDefectiveArea,
      hasDisable: hasDisable,
      hasYdc: hasYdc,
    }).then((res) => {
      if (Array.isArray(res)) {
        setDataSource(res);
        if (defaultValue) {
          const defalut = res.find((item: any) => {
            return item.locationAreaName === defaultValue;
          });
          if (defalut) {
            onChange?.(defalut.locationAreaId, defalut);
          }
        }
      }
    });
  };

  useEffect(() => {
    if (!local && autoload) {
      loadData();
    }
  }, []);

  useUpdateEffect(() => {
    if (!local) {
      loadData();
    }
  }, [hasDisable, hasDefectiveArea, hasYdc, JSON.stringify(params)]);

  useEffect(() => {
    if (local) {
      setDataSource(Array.isArray(locationareaList) ? locationareaList : []);
    }
  }, [JSON.stringify(locationareaList)]);

  const otherExtProps = extProps ? extProps?.(record) : {};

  const onHandleChange = (
    value: any,
    option: DefaultOptionType | DefaultOptionType[]
  ) => {
    if (props.value == null) {
      onChange?.(value, option);
      return;
    }
    if (needWarned) {
      CModal.confirm({
        title: changeWarngingMsg || defaultWaringMsg,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          onChange?.(value, option);
        },
      });
    } else {
      onChange?.(value, option);
    }
  };

  let newdata = dataSource;

  if (filterData) {
    newdata = filterData(newdata);
  }

  if (readonly) {
    if (bizDeptType !== 'SHOP' && bizDeptType !== 'WAREHOUSE') {
      return <div>{resProps.value}</div>;
    }
    const areaName = dataSource.find(
      (it) =>
        it.locationAreaId === resProps.value ||
        it.locationAreaName === resProps.value
    );
    return <div>{areaName ? areaName.locationAreaName : ''}</div>;
  }

  return (
    <ScSelect
      labelInValue={false}
      textField="locationAreaName"
      valueField="locationAreaId"
      allowClear
      data={newdata}
      onChange={onHandleChange}
      {...resProps}
      {...otherExtProps}
    ></ScSelect>
  );
};

LocationAreaSelect.customView = true;

export default LocationAreaSelect;
