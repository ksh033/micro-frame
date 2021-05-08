import React, { Key, useMemo, useState } from 'react'
import { ScTree } from '@scboson/sc-element'
import { uesRequest } from '../../../utils/api'
import BsTable from '../../Base/BsTable'
import { ListPage, PageConfig, useListPageContext } from '@scboson/sc-schema'
import list from './list'
import BsSearch from '../../Base/BsSearch'
import { ProColumn } from '@scboson/sc-schema/lib/interface'
import { RowSelectionType } from 'antd/lib/table/interface'

import styles from './index.less'

const pagaConfig: PageConfig = {
  service: {},
  ...list,
}

export type SelectCargoTableProps = {
  extraColumns?: ProColumn[]
  request: (params: any) => Promise<any> // 请求数据的远程方法
  params?: any
  selectionType: RowSelectionType
  onTabelRow?: (selectedRowKeys: string[], selectedRows: any[]) => void
  selectedRowKeys?: string[]
}

const SelectCargoTable: React.FC<any> = (props: SelectCargoTableProps) => {
  const {
    extraColumns,
    request,
    params,
    selectionType = 'checkbox',
    onTabelRow,
    selectedRowKeys,
  } = props
  const { run } = uesRequest('catalog', 'treeData')
  const [catalogId, setCatalogId] = useState<string | null>()
  const page = useListPageContext()
  const search = page.getSearch({})
  const searchConfig = search.toConfig()

  const pageTable = page.getTable()
  if (Array.isArray(extraColumns) && extraColumns.length > 0) {
    extraColumns.forEach((item: ProColumn) => {
      pageTable.addCol(item)
    })
  }
  const pageInfo = pageTable.toConfig()

  const loadDataPramsFormat = (item: any) => {
    return {
      parentCatalogCode: item.catalogCode,
    }
  }
  const treeParams = useMemo(() => {
    return {
      parentCatalogCode: 0,
    }
  }, [])

  const onSelectRow = (_selectedRowKeys: any[], _selectedRows: any[]) => {
    onTabelRow && onTabelRow(_selectedRowKeys, _selectedRows)
  }

  const handleSelect = (selectedKeys: Key[]) => {
    setCatalogId(selectedKeys[0] ? String(selectedKeys[0]) : null)
  }
  const tableParams = useMemo(() => {
    return {
      ...pageInfo.params,
      ...params,
      catalogId,
    }
  }, [JSON.stringify(pageInfo.params), params, catalogId])

  return (
    <div className={styles.cell}>
      <div className={styles['cell-left']}>
        <div>
          <a>全部货品</a>
        </div>
        <ScTree
          canSearch={false}
          placeholder={'search'}
          async={true}
          showLine={true}
          loadDataPramsFormat={loadDataPramsFormat}
          autoload={true}
          request={run}
          params={treeParams}
          textField="catalogName"
          onSelect={handleSelect}
          valueField="catalogId"
        />
      </div>
      <div className={styles['catalog-table']}>
        <BsSearch {...searchConfig}></BsSearch>
        <BsTable
          checkbox
          autoload={true}
          {...pageInfo}
          rowSelection={{
            type: selectionType,
          }}
          rowKey="cargoId"
          onSelectRow={onSelectRow}
          selectedRowKeys={selectedRowKeys}
          params={tableParams}
          request={request}
        ></BsTable>
      </div>
    </div>
  )
}

export default ListPage(SelectCargoTable, pagaConfig)
