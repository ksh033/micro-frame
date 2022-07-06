/* eslint-disable max-len */

import { CModal, ScSelect } from '@scboson/sc-element';
import {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form';
import type { ScSelectProps } from '@scboson/sc-element/es/sc-select';
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
    hasDisable?: boolean;
    hasDefectiveArea?: boolean;
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
    changeWarngingMsg,
    local = false,
    ...resProps
  } = props;

  const [dataSource, setDataSource] = useState<any[]>([]);
  const record = props['data-row'] || props.rowData || initialValues || {};

  const user = getUser();
  const bizDeptType = user?.userAppInfo?.currentDept.bizDeptType;

  const defaultWaringMsg = `切换${
    bizDeptType === 'SHOP' ? '档口' : '库区'
  }后,下方货品明细将被清空，是否确定切换`;

  useEffect(() => {
    if (!local) {
      run({
        hasDefectiveArea: hasDefectiveArea,
        hasDisable: hasDisable,
      }).then((res) => {
        if (Array.isArray(res)) {
          setDataSource(res);
        }
      });
    }
  }, [hasDisable, hasDefectiveArea]);

  useEffect(() => {
    if (local) {
      setDataSource(locationareaList);
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

  if (readonly) {
    const areaName = dataSource.find(
      (it) => it.locationAreaId === resProps.value
    );
    return <div>{areaName ? areaName.locationAreaName : ''}</div>;
  }

  let newdata = dataSource;

  if (filterData) {
    newdata = filterData(newdata);
  }

  return (
    <ScSelect
      labelInValue={false}
      textField="locationAreaName"
      valueField="locationAreaId"
      allowClear
      data={newdata}
      filterOption={false}
      defaultActiveFirstOption={false}
      onChange={onHandleChange}
      {...resProps}
      {...otherExtProps}
    ></ScSelect>
  );
};

LocationAreaSelect.customView = true;

export default LocationAreaSelect;
