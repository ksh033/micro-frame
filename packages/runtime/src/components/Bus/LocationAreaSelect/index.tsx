/* eslint-disable max-len */

import { CModal, ScSelect } from '@scboson/sc-element';
import {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form';
import type { ScSelectProps } from '@scboson/sc-element/es/sc-select';
import { DefaultOptionType } from 'antd/es/select';
import { getUser } from '../../Auth';
import userLocationarea from '../../Dict/userLocationarea';

type LocationAreaSelectProps = FormComponentProps &
  ScSelectProps & {
    filterData?: (list: any[]) => any[];
    extProps?: (record) => LocationAreaSelectProps;
    rowData?: any;
    needWarned?: boolean;
    changeWarngingMsg?: string;
  };

const LocationAreaSelect: FormComponent<LocationAreaSelectProps> = (props) => {
  const { locationareaList } = userLocationarea();
  const {
    labelInValue = false,
    readonly,
    initialValues,
    filterData,
    extProps,
    rowData,
    onChange,
    needWarned = false,
    changeWarngingMsg,
    ...resProps
  } = props;

  const record = props['data-row'] || rowData || initialValues || {};

  let newdata = Array.isArray(locationareaList) ? locationareaList : [];

  const user = getUser();
  const bizDeptType = user?.userAppInfo?.currentDept.bizDeptType;

  const defaultWaringMsg = `切换${
    bizDeptType === 'SHOP' ? '档口' : '库区'
  }后,下方货品明细将被清空，是否确定切换`;

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
    const areaName = newdata.find((it) => it.locationAreaId === resProps.value);
    return <div>{areaName ? areaName.locationAreaName : ''}</div>;
  }

  if (filterData) {
    newdata = filterData(newdata);
  }

  return (
    <ScSelect
      labelInValue={labelInValue}
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
