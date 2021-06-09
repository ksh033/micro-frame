import React, { useMemo } from 'react'
import { uesRequest } from '../../../utils/api'
import BsTable from '../../Base/BsTable'
import BsSearch from '../../Base/BsSearch'
import list from './list'
import type { PageConfig } from '@scboson/sc-schema'
import { useListPageContext } from '@scboson/sc-schema'
import { ListPage } from '@scboson/sc-schema'
import userDictModel from '../../../components/Dict/userDictModel'

const pagaConfig: PageConfig = {
  ...list,
}

const Table: React.FC<any> = (props: any) => {
  const { pageProps } = props
  const { selectionType, onTabelRow, rowKey, selectedRowKeys } = pageProps
  const { run } = uesRequest('system', 'shop')

  const page = useListPageContext()
  const search = page.getSearch({})
  const searchConfig = search.toConfig()

  const { getDistList } = userDictModel()

  const shopBusinessMap = useMemo(() => {
    const rlist = getDistList({
      dictTypeCode: 'shopBusiness',
    })
    const map = new Map()
    if (Array.isArray(rlist)) {
      rlist.forEach((item) => {
        map.set(item.value, item.name)
      })
    }
    return map
  }, [getDistList])

  const pageInfo = page
    .getTable()
    .changeCol('shopBusiness', {
      render: (text: string, record: any) => {
        const rlist = record.shopBusinessList
        let str = Array.isArray(rlist)
          ? rlist
              .map((item) => {
                return shopBusinessMap.get(item)
              })
              .join('，')
          : '--'
        if (str === '') {
          str = '--'
        }
        return str
      },
    })
    .toConfig()

  const params = useMemo(() => {
    return pageInfo.params
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
