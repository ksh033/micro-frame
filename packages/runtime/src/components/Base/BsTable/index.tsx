/* eslint-disable no-param-reassign */
import React from 'react'
import { ScTable } from '@scboson/sc-element'
import type { ScTableProps } from '@scboson/sc-element/lib/sc-table'
import defaultRenderText, { cacheRender } from '../../Dict/defaultRender'
import { getUser } from '../../Auth'
import userDictModel from '../../Dict/userDictModel'
import ToolBar from '../ToolBar'
import Authority from '../Authority'

import styles from './index.less'

const { Operation } = ScTable

export interface BsTableProps extends ScTableProps<any> {
  toolbar?: any[]
}

const BsTable: React.FC<BsTableProps> = (props: BsTableProps) => {
  const { toolbar = [], columns = [], data, ...restProps } = props

  const { dict, getBySysCode } = userDictModel()
  const user = getUser()
  const systemCode = user?.userAppInfo.currentSystem.systemCode || ''
  const sysMap = getBySysCode(systemCode)

  columns.forEach((col: any) => {
    const list: any = sysMap[`${col.dataType || col.dataIndex}`]
    if (!col.width) {
      col.width = 180
    }
    if (list && !col.render) {
      col.render = (text: string) => {
        return cacheRender(text, list)
      }
    } else if (col.dataType && !col.render) {
      col.render = (text: string, record: any) => {
        return defaultRenderText(text, col.dataType || col.dataIndex, record)
      }
    }
  })

  const hasToolBar = Array.isArray(toolbar) && toolbar.length > 0
  return (
    <>
      {hasToolBar ? (
        <div className={styles['bs-table-toolbar']}>
          <ToolBar buttons={toolbar}></ToolBar>
        </div>
      ) : null}
      <div className={!hasToolBar ? styles['bs-table-list'] : ''}>
        <ScTable {...restProps} data={data} columns={columns} />
      </div>
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
type BsTable = typeof BsTable
interface Table extends BsTable {
  Operation: any
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Table: Table = BsTable as Table
Table.Operation = Authority(Operation)

export default Table
