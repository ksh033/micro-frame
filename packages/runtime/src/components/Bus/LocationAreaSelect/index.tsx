/* eslint-disable max-len */

import { ScSelect } from '@scboson/sc-element';
import {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form';
import type { ScSelectProps } from '@scboson/sc-element/es/sc-select';
import userLocationarea from '../../Dict/userLocationarea';

type LocationAreaSelectProps = FormComponentProps &
  ScSelectProps & {
    filterData?: (list: any[]) => any[];
    extProps?: (record) => LocationAreaSelectProps;
  };

const LocationAreaSelect: FormComponent<LocationAreaSelectProps> = (props) => {
  const { locationareaList } = userLocationarea();
  const {
    labelInValue = false,
    readonly,
    initialValues,
    filterData,
    extProps,
    ...resProps
  } = props;

  const record = props['data-row'] || initialValues || {};

  let newdata = Array.isArray(locationareaList) ? locationareaList : [];

  const otherExtProps = extProps ? extProps?.(record) : {};

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
      {...resProps}
      {...otherExtProps}
    ></ScSelect>
  );
};

LocationAreaSelect.customView = true;

export default LocationAreaSelect;
