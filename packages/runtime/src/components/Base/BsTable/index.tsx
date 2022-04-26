import React from 'react'
import { ScTable } from '@scboson/sc-element'
import type { ScTableProps } from '@scboson/sc-element/es/sc-table'
import defaultRenderText, { cacheRender } from '../../Dict/defaultRender'
import userDictModel from '../../Dict/userDictModel'
import ToolBar from '../ToolBar'
import Authority from '../../Auth/Authority'
import styles from './index.less'
import { isArray } from 'lodash'
import Operation from './Operation'

export interface BsTableProps extends ScTableProps<any> {
  toolbar?: any[]
  sysCode?: string
}
export interface BsTableComponentProps {
  dataIndex?: string
  rowData?: any
  value?: any
}

const BsTable: React.FC<BsTableProps> = (props: BsTableProps) => {
  const {
    toolbar = [],
    columns = [],
    data,
    toolBarRender,
    onLoad,
    ...restProps
  } = props

  const { getDistList } = userDictModel()

  const lastCol: any = columns[columns.length - 1]

  const columnsFormat = (list: any[]) => {
    list.forEach((col: any, index: number) => {
      if (Array.isArray(col.children) && col.children.length > 0) {
        col.children = columnsFormat(col.children)
      }

      const list: any = getDistList({
        syscode: col.sysCode,
        dictTypeCode: `${col.dataType || col.dataIndex}`,
      })
      if (!col.width) {
        col.width = 180
      }
      // if (columns.length > 3) {
      //   if (lastCol.dataIndex !== '_OperateKey') {
      //     if (index === columns.length - 2) {
      //        col.width='auto'
      //     }
      //   } else {
      //     if (index === columns.length - 1) {
      //       delete col.width
      //     }
      //   }
      // }

      if (list && !col.render) {
        col.render = (text: string) => {
          return cacheRender(text, list)
        }
      } else if (col.dataType && !col.render) {
        col.render = (text: string, record: any) => {
          return defaultRenderText(text, col.dataType || col.dataIndex, record)
        }
      } else if (col.component && !col.render) {
        const comProps = col.props || {}
        col.render = (text: any, record: any) => {
          if (
            col.component.displayName &&
            col.component.displayName === 'Enabled'
          ) {
            if (!comProps['funcode']) comProps['funcode'] = 'ENABLE'
          }
          const component =
            typeof col.component === 'function'
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
                })
          return component
        }
      }else if(list && col.render) {

        const render=col.render
        col.render=(text, record, index)=>{
          const dictText=cacheRender(text, list);
          return render(dictText, record, index);
        }
      }
      delete col.sysCode
    })

    return list
  }

  const newColumns = columnsFormat(columns)

  let newToolBarRender: any

  let rtoolBarRender: any = () => {
    const hasToolBar = Array.isArray(toolbar) && toolbar.length > 0
    const toolBarRender = hasToolBar ? (
      <ToolBar
        buttons={toolbar}
        className={styles['bs-table-toolbar-btn']}
      ></ToolBar>
    ) : (
      []
    )
    return toolBarRender
  }
  if (toolBarRender === false) {
    newToolBarRender = false
  } else {
    if (toolBarRender) {
      newToolBarRender = toolBarRender
    } else {
      newToolBarRender = rtoolBarRender
    }
  }
  const dataLoad = (data: any) => {
    let newData = {}
    if (data) {
      if (!isArray(data)){
        let rows = data.records || data.rows || []
        const { current = 1, size = 10 } = data
        rows = rows.map((item: any, index: number) => {
          const titem = item
          titem.index = index + 1 + (current - 1) * size
          return titem
        })
        newData = {
          rows,
          total: data.total,
          current,
          size,
        }
      }else{
        newData=data
      }
      
    } else {
      newData = {
        total: 0,
        rows: [],
      }
    }

    onLoad && onLoad(newData)

    return newData
  }
  return (
    <>
      <div className={'bs-table-list'}>
        <ScTable
          {...restProps}
          onLoad={dataLoad}
          data={data}
          columns={newColumns}
          size="small"
          toolBarRender={newToolBarRender}
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
