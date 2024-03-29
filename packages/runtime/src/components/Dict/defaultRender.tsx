/* eslint-disable @typescript-eslint/no-unused-vars */
import { Badge } from "antd";
import React from "react";
import { decimalPoint } from "../../utils/common";
import BsImg from "../Base/BsImg";
import {
  dataTime,
  defaultNumber,
  formatMoneyQuery as fmq,
  money,
  rate,
  unitprice,
  formatNumber,
} from "./format";
import useWeightUnit from "./weightUnit";

export const formatMoneyQuery = fmq;

const UnitFormat: React.FC<any> = (props) => {
  const { valueType, text, record } = props;
  const { has } = useWeightUnit();
  const unitName = valueType.split("_")[1];

  if (text !== undefined && text !== null) {
    const value = has(record[unitName])
      ? Number(decimalPoint(text, 3)).toFixed(3)
      : text;

    return <span>{value}</span>;
  }
  return null;
};

const status = (text: any) => {
  let result: any = "--";
  if (text === true) {
    result = <Badge color="#73D13D" text="启用" />;
  }
  if (text === false) {
    result = <Badge color="#FFA940" text="停用" />;
  }
  return result;
};

/**
 * 根据不同的类型来转化数值
 *
 * @param text
 * @param valueType
 */
const defaultRenderText = <T, U>(
  text: string | number | React.ReactText[],
  valueType: string,
  record: any = {}
): React.ReactNode => {
  let newText: any = text;
  switch (valueType) {
    case "defaultNumber":
      newText = defaultNumber(text);
      break;
    case "unitprice":
      newText = unitprice(text);
      break;
    case "money":
      newText = money(text, true);
      break;
    case "status":
      newText = status(text);
      break;
    case "dataTime":
      newText = dataTime(text);
      break;
    case "media":
      newText = <BsImg src={text} />;
      break;
    case "rate":
      newText = rate(text);
      break;
    case "empty":
      newText = text != null ? text : "--";
      break;
    // case "saleUnit": {
    //   const { saleUnit } = record || {};
    //   //if (params.)
    //   newText = text
    //   //const [value,record,index,dictText]=
    //   if (saleUnit)
    //     newText = `${saleUnit}(${text})`;
    // }
    case "number": {
      newText = formatNumber(text);
      break;
    }

    default:
      break;
  }
  if (
    valueType === "un_cargoUnit" ||
    valueType === "un_stockUnit" ||
    valueType === "un_purchaseUnit" ||
    valueType === "un_distributeUnit"
  ) {
    return (
      <UnitFormat
        valueType={valueType}
        text={text}
        record={record}
      ></UnitFormat>
    );
  }

  return newText;
};

export const cacheRender = (
  text: string | number,
  list: any[]
): React.ReactNode => {
  if (Array.isArray(list)) {
    const index = list.findIndex((item: any) => {
      return item.value === `${text}`;
    });
    if (index > -1) {
      return list[index].name;
    }
  }

  return text;
};

export default defaultRenderText;
