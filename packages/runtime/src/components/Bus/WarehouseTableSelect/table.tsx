import React, { useMemo } from "react";
import { uesRequest } from "../../../utils/api";
import BsTable from "../../Base/BsTable";
import BsSearch from "../../Base/BsSearch";
import list from "./list";
import type { PageConfig } from "@scboson/sc-schema";
import { useListPageContext } from "@scboson/sc-schema";
import { ListPage } from "@scboson/sc-schema";
import { Tag } from "antd";

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
    rowSelection,
    needAll = true,
    params,
    disableSelect,
  } = pageProps;
  const { run } = uesRequest("system", "warehouse");

  const page = useListPageContext();
  const search = page.getSearch({});
  const searchConfig = search.toConfig();

  const pageInfo: any = page
    .getTable()
    .changeCol("warehouseName", {
      render(val: any, record: any) {
        if (record.enabled) {
          return val;
        }
        return (
          <>
            {val}
            <Tag color="red">已停用</Tag>
          </>
        );
      },
    })
    .changeCol("detailAddress", {
      render: (text: string, record: any) => {
        const provinceName = record.provinceName || "";
        const cityName = record.cityName || "";
        const districtName = record.districtName || "";
        return `${provinceName}${cityName}${districtName}${
          record.detailAddress || ""
        }`;
      },
    })
    .toConfig();

  const nParams = useMemo(() => {
    console.log(pageInfo.params);

    return {
      ...params,
      ...pageInfo.params,
      needAll,
      orders: [
        {
          asc: false,
          column: "enabled",
        },
      ],
    };
  }, [JSON.stringify(pageInfo.params)]);
  return (
    <div style={{ padding: "20px" }}>
      <BsSearch {...searchConfig} />
      <BsTable
        {...pageInfo}
        checkbox
        rowSelection={{
          type: selectionType,
          ...(rowSelection || {
            getCheckboxProps: (record: any) => ({
              disabled: record.enabled === false && disableSelect === false, // Column configuration not to be checked
              // name: record.name,
            }),
          }),
        }}
        autoload
        rowKey={rowKey}
        request={run}
        onSelectRow={onTabelRow}
        selectedRowKeys={selectedRowKeys}
        params={nParams}
        scroll={{ y: 240 }}
      />
    </div>
  );
};

const WarehouseTable: any = ListPage(Table, pagaConfig);
export default WarehouseTable;
