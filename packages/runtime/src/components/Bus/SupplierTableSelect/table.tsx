import React, { useMemo } from 'react'
import { uesRequest } from '../../../utils/api'
import BsTable from '../../Base/BsTable'
import BsSearch from '../../Base/BsSearch'
import list from './list'
import type { PageConfig } from '@scboson/sc-schema'
import { useListPageContext } from '@scboson/sc-schema'
import { ListPage } from '@scboson/sc-schema'
import styles from './index.less'

const pagaConfig: PageConfig = {
  ...list,
}

const Table: React.FC<any> = (props: any) => {
  const { pageProps } = props
  const {
    selectionType,
    onTabelRow,
    rowKey,
    selectedRowKeys,
    isCooperateSupplier = false,
  } = pageProps
  const { run } = isCooperateSupplier
    ? uesRequest('system', 'cooperateSupplier')
    : uesRequest('system', 'supplier')
  const page = useListPageContext()
  const search = page.getSearch({
    tableKey: isCooperateSupplier ? 'cooperateSupplier' : 'supplier',
  })
  const searchConfig = search.toConfig()
  const pageInfo = page.getTable().toConfig()

  const params = useMemo(() => {
    return {
      ...pageInfo.params,
      enabled: true,
    }
  }, [JSON.stringify(pageInfo.params)])
  return (
    <div style={{ padding: '20px' }}>
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
      />
    </div>
  )
}

export default ListPage(Table, pagaConfig)
