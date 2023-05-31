import React, { useMemo } from "react";
import { uesRequest } from "../../../utils/api";
import { ScSelect } from "@scboson/sc-element";
import { ScSelectProps } from "@scboson/sc-element/es/sc-select";
import {
  FormComponent,
  FormComponentProps,
} from "@scboson/sc-element/es/c-form";
interface TableSelectProps extends ScSelectProps, FormComponentProps {
  limit?: number;
  isCooperateSupplier?: boolean;
  supplierEnabled?: boolean;
  exterParams?: any;
}

const SupplierSelect: FormComponent<TableSelectProps> = (props) => {
  const {
    isCooperateSupplier = false,
    supplierEnabled = true,
    exterParams = {},
    valueField = "supplierId",
    textField = "supplierName",
    readonly,
    ...resprops
  } = props;
  const { run } = isCooperateSupplier
    ? uesRequest("system", "cooperateSupplier")
    : uesRequest("system", "supplier");

  const params = useMemo(() => {
    return {
      enabled: supplierEnabled,
      current: 1,
      size: 15,
      ...exterParams,
    };
  }, [supplierEnabled, JSON.stringify(exterParams)]);

  const formatInputValue = (obj: any) => {
    if (obj != null) {
      const values = obj[textField] || "";
      return values;
    }
    return "";
  };

  const onLoad = (res) => {
    console.log(res);
    if (Array.isArray(res)) {
      return res;
    }
    if (Array.isArray(res.rows)) {
      return res.rows;
    }
    if (Array.isArray(res.records)) {
      return res.records;
    }
    return [];
  };

  if (readonly === true) {
    return <span>{formatInputValue(props.value)}</span>;
  }

  return (
    <ScSelect
      request={run}
      params={params}
      remoteSearch={true}
      showSearch={true}
      autoload={true}
      searchField="supplierCodeName"
      textField={textField}
      valueField={valueField}
      labelInValue
      filterOption={false}
      allowClear
      onLoad={onLoad}
      defaultActiveFirstOption={false}
      {...resprops}
    ></ScSelect>
  );
};
SupplierSelect.customView = true;

export default SupplierSelect;
