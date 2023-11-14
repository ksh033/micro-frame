import React from "react";
import { DatePicker } from "antd";
// import dayjs from "dayjs";
// import utc from 'dayjs/plugin/utc'

import { ScDatePicker } from "@scboson/sc-element";

const ScRangePicker = ScDatePicker.ScRangePicker;
const { RangePicker } = DatePicker;

const CRangePicker: React.FC<any> = (props) => {
  // let newValue = props.value;
  // if (Array.isArray(newValue) && newValue.length > 0) {
  //   const startTime = newValue[0];
  //   const endTime = newValue[1];
  //   if (typeof startTime==="string"){
  //     newValue = [
  //       dayjs.utc(startTime, props.format),
  //       dayjs.utc(endTime, props.format),
  //     ];
  //   }else{
  //     if (!startTime.weekday){
  //       console.log("dayjs","weekday")
  //     }
  //     newValue=[startTime,endTime]

  //   }
     
  // }

  return <ScRangePicker {...props} ></ScRangePicker>;
};

export default CRangePicker;
