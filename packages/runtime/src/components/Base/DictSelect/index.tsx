import React, { useMemo } from "react";
import userDictModel from "../../Dict/userDictModel";
import { ScSelect, ScRadio, ScCheckBox } from "@scboson/sc-element";
import {
  FormComponent,
  FormComponentProps,
  deepGet,
} from "@scboson/sc-element/es/c-form";

export interface DictSelectProp extends FormComponentProps {
  /** 字典类型 */
  dictType: string;
  type?: "Select" | "Radio" | "CheckBox";
  fieldProps?: any;
  filterData?: (dictData: any[]) => any[];
  rowData?: any;
  splitDot?: string;
  /** 本地数据 */
  localDict?: boolean;
  emptyItem?: boolean | { name: any; value: any };

  [key: string]: any;
}

const EMPTY_ITEM = { name: "全部", value: "" };
/**
 * 字典控件
 *
 * @param pros 字典控件属性
 */
const DictSelect: FormComponent<DictSelectProp> = (pros: DictSelectProp) => {
  const {
    dictType,
    readonly,
    type = "Select",
    name,
    form,
    initialValues,
    formItemProps,
    fieldProps,
    filterData,
    emptyItem,
    splitDot = "、",
    rowData,
    localDict = false,
    ...restProps
  } = pros;
  const { getDistList } = userDictModel();

  let data = useMemo(() => {
    const list: any[] = getDistList({
      dictTypeCode: dictType,
      localDict,
    });
    let emptyDataItem;
    if (emptyItem) {
      emptyDataItem = EMPTY_ITEM;
      if (typeof emptyItem == "object") {
        emptyDataItem = emptyItem;
      }
      if (list) {
        list.unshift(emptyDataItem);
      }
    }
    if (list) {
      return list;
    }
    return [];
  }, [dictType, localDict]);

  if (filterData) {
    data = filterData(data);
  }
  if (readonly) {
    let newName: any = name || "";
    const formData: any = form?.getFieldsValue() || {};
    let val = deepGet(formData, newName);
    if (!val && initialValues) {
      val = deepGet(initialValues, newName);
    }
    if (Array.isArray(val)) {
      const valItemList = data
        .filter((it) => {
          return val.indexOf(it.value) > -1;
        })
        .map((item) => item.name);

      return <span>{valItemList.join(splitDot)}</span>;
    } else {
      const valItem = data.find((item) => {
        return item.value === val;
      });
      const text = valItem?.name;

      return <span>{text}</span>;
    }
  } else {
    if (type === "Radio") {
      const radioProps: any = restProps;
      return (
        <ScRadio
          textField="name"
          valueField="value"
          data={data}
          {...radioProps}
        ></ScRadio>
      );
    }
    if (type === "CheckBox") {
      const checkProps: any = restProps;
      return (
        <ScCheckBox
          textField="name"
          valueField="value"
          data={data}
          {...checkProps}
        ></ScCheckBox>
      );
    }
    return (
      <ScSelect
        textField="name"
        valueField="value"
        data={data}
        allowClear
        showSearch
        {...restProps}
      ></ScSelect>
    );
  }
};
DictSelect.customView = true;

export default DictSelect;
