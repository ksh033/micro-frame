/* eslint-disable max-len */

import React, { useRef, useEffect, useMemo } from "react";
import { uesRequest } from "../../../utils/api";
import { ScSelect } from "@scboson/sc-element";
import { ScSelectProps } from "@scboson/sc-element/es/sc-select";
interface TableSelectProps extends ScSelectProps {
  limit?: number;
}

const CooperateSupplierSelect: React.FC<TableSelectProps> = (props) => {
  const { run } = uesRequest("system", "cooperateSupplierList");

  const params = useMemo(
    () => ({
      size: props.limit || 15,
    }),
    [props.limit]
  );

  return (
    <ScSelect
      {...props}
      params={params}
      request={run}
      remoteSearch={true}
      showSearch={true}
      autoload={true}
      searchField="supplierCodeName"
      textField="supplierName"
      valueField="supplierId"
      filterOption={false}
      allowClear
      defaultActiveFirstOption={false}
    ></ScSelect>
  );
};

export default CooperateSupplierSelect;
