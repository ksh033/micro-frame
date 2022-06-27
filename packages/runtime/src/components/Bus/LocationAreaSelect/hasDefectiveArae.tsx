/* eslint-disable max-len */

import { ScSelect } from '@scboson/sc-element';
import {
  FormComponent,
  FormComponentProps,
} from '@scboson/sc-element/es/c-form';
import type { ScSelectProps } from '@scboson/sc-element/es/sc-select';
import { useEffect, useState } from 'react';
import { uesRequest } from '../../../utils/api';

type LocationAreaSelectProps = FormComponentProps &
  ScSelectProps & {
    filterData?: (list: any[]) => any[];
    extProps?: (record) => LocationAreaSelectProps;
  };

const LocationAreaSelect: FormComponent<LocationAreaSelectProps> = (props) => {
  const { run } = uesRequest('system', 'locationAreaList');
  const { readonly, initialValues, filterData, extProps, ...resProps } = props;

  const [dataSource, setDataSource] = useState<any[]>([]);
  const record = props['data-row'] || initialValues || {};

  useEffect(() => {
    run({
      hasDefectiveArea: true,
    }).then((res) => {
      if (Array.isArray(res)) {
        setDataSource(res);
      }
    });
  }, []);

  const otherExtProps = extProps ? extProps?.(record) : {};

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
      {...resProps}
      {...otherExtProps}
    ></ScSelect>
  );
};

LocationAreaSelect.customView = true;

export default LocationAreaSelect;
