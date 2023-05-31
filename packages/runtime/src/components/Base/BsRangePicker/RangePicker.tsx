import React from "react";
import { DatePicker } from "antd";
import moment from "moment";

import { ScDatePicker } from "@scboson/sc-element";

const ScRangePicker = ScDatePicker.ScRangePicker;
const { RangePicker } = DatePicker;

const CRangePicker: React.FC<any> = (props) => {
  let newValue = props.value;
  if (Array.isArray(newValue) && newValue.length > 0) {
    const startTime = newValue[0];
    const endTime = newValue[1];
    newValue = [
      moment.utc(startTime, props.format),
      moment.utc(endTime, props.format),
    ];
  }

  return <ScRangePicker {...props} value={newValue}></ScRangePicker>;
};

export default CRangePicker;
