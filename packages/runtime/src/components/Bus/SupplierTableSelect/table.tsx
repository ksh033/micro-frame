import React, { useMemo } from "react";
import { uesRequest } from "../../../utils/api";
import BsTable from "../../Base/BsTable";
import BsSearch from "../../Base/BsSearch";
import list from "./list";
import type { PageConfig } from "@scboson/sc-schema";
import { useListPageContext } from "@scboson/sc-schema";
import { ListPage } from "@scboson/sc-schema";

const pagaConfig: PageConfig = {
  ...list,
};

const Table: React.FC<any> = (props: any) => {
  const { pageProps } = props;
  const {
    selectionType,
    onTabelRow,
    rowKey,
    selectedRowKeys,
    isCooperateSupplier = false,
    supplierEnabled = true,
    exterParams = {},
  } = pageProps;
  const { run } = isCooperateSupplier
    ? uesRequest("system", "cooperateSupplier")
    : uesRequest("system", "supplier");
  const page = useListPageContext();
  const search = page.getSearch({
    tableKey: isCooperateSupplier ? "cooperateSupplier" : "supplier",
  });
  const searchConfig = search.toConfig();
  const pageInfo: any = page.getTable().toConfig();

  const params = useMemo(() => {
    return {
      ...pageInfo.params,
      enabled: supplierEnabled,
      ...exterParams,
    };
  }, [
    JSON.stringify(pageInfo.params),
    supplierEnabled,
    JSON.stringify(exterParams),
  ]);
  return (
    <div style={{ padding: "20px" }}>
      <BsSearch {...searchConfig} />
      <BsTable
        {...pageInfo}
        checkbox
        rowSelection={{
          type: selectionType,
        }}
        autoload
        rowKey={rowKey}
        request={run}
        onSelectRow={onTabelRow}
        selectedRowKeys={selectedRowKeys}
        params={params}
        scroll={{ y: 240 }}
      />
    </div>
  );
};
const SupplierTable: React.FunctionComponent = ListPage(Table, pagaConfig);

export default SupplierTable;
