/* eslint-disable no-param-reassign */
import React from 'react'
import { ScTable } from '@scboson/sc-element'
import type { ScTableProps } from '@scboson/sc-element/lib/sc-table/ScTable'
import defaultRenderText, { cacheRender } from '../../Dict/defaultRender'
import type { ColumnsType } from 'antd/lib/table/Table'
import { getUser } from '../../Auth'
import userDictModel from '../../Dict/userDictModel'
import ToolBar from '../ToolBar'
import Authority from '../Authority'

import styles from './index.less'

const { Operation } = ScTable

export interface BsTableProps extends Omit<ScTableProps<any>, 'columns'> {
  toolbar?: any[]
  sysCode?: string
  columns?: ColumnsType<any> & {
    sysCode?: string
  }
}
export interface BsTableComponentProps {
  dataIndex?: string;
  rowData?: any;
  value?: any;
}

const BsTable: React.FC<BsTableProps> = (props: BsTableProps) => {
  const { toolbar = [], columns = [], data, ...restProps } = props

  const { dict, getBySysCode } = userDictModel()
  const user = getUser()
  const systemCode = user?.userAppInfo.currentSystem.systemCode || ''
  const sysMap = getBySysCode(systemCode)

  columns.forEach((col: any, index: number) => {
    const cSysMap = col.sysCode ? getBySysCode(col.sysCode) : sysMap
    const list: any = cSysMap[`${col.dataType || col.dataIndex}`]
    if (!col.width) {
      col.width = 180
    }

    if (list && !col.render) {
      col.render = (text: string) => {
        return cacheRender(text, list)
      }
    } else if (col.dataType && !col.render) {
      col.render = (text: string, record: any) => {
        return defaultRenderText(text, col.dataType || col.dataIndex, record);
      };
    } else if (col.component && !col.render) {
      const comProps = col.props || {};
      col.render = (text: any, record: any) => {
        const component =
          typeof col.component === "function"
            ? React.createElement(col.component, {
                rowData: record,
                dataIndex: col.dataIndex,
                value: text,
                ...comProps,
              })
            : React.cloneElement(col.component, {
                rowData: record,
                dataIndex: col.dataIndex,
                value: text,
                ...comProps,
              });
        return component;
      };
    }
    delete col.sysCode
  })

  return (
    <>
      <div className={'bs-table-list'}>
        <ScTable
          {...restProps}
          data={data}
          columns={columns}
          toolBarRender={() => {
            const hasToolBar = Array.isArray(toolbar) && toolbar.length > 0
            const toolBarRender = hasToolBar
              ? [
                  <ToolBar
                    buttons={toolbar}
                    className={styles['bs-table-toolbar-btn']}
                  ></ToolBar>,
                ]
              : []
            return toolBarRender
          }}
        />
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
