import React from 'react'
import { ScEditableTable } from '@scboson/sc-element'
import defaultRenderText, { cacheRender } from '../../Dict/defaultRender'
import userDictModel from '../../Dict/userDictModel'
import { EditableProTableProps } from '@scboson/sc-element/es/sc-editable-table'
import { Key } from 'antd/es/table/interface'
import { FormInstance } from 'antd/es/form/Form'
import Form from 'antd/es/form'
import useMergedState from 'rc-util/es/hooks/useMergedState'

export interface BsEditTableProps extends EditableProTableProps<any> {
  type: 'multiple' | 'single'
  editableKeys?: Key[]
  setEditableRowKeys?: (editableKeys: Key[], editableRows: any) => void
  innerForm?: FormInstance<any>
}

const BsEditTable: React.FC<BsEditTableProps> = (props: BsEditTableProps) => {
  const {
    columns = [],
    value,
    onChange,
    innerForm,
    readonly,
    editableKeys,
    setEditableRowKeys,
    type = 'multiple',
    showIndex = true,
    pagination = {},
    clickEdit = true,
    rowKey = 'rowIndex',
    scroll = { x: 'max-content' },
    ...restProps
  } = props

  const { getDistList } = userDictModel()
  const [form] = Form.useForm()
  const newForm = innerForm ? innerForm : form

  const [editableRowKey, setRowKeys] = useMergedState<Key[]>(
    () => editableKeys || [],
    {
      value: editableKeys,
      onChange: setEditableRowKeys,
    }
  )

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

      if (list && !col.render) {
        col.render = (text: string) => {
          return cacheRender(text, list)
        }
      } else if (col.dataType && !col.render) {
        col.render = (text: string, record: any) => {
          return defaultRenderText(text, col.dataType || col.dataIndex, record)
        }
      }
      delete col.sysCode
    })

    return list
  }

  const newColumns = columnsFormat(columns)

  return (
    <ScEditableTable<any>
      columns={newColumns}
      value={value}
      onChange={onChange}
      rowKey={rowKey}
      clickEdit={clickEdit}
      pagination={pagination}
      showIndex={showIndex}
      scroll={scroll}
      editable={{
        // @ts-ignore
        form: newForm,
        type: type,
        editableKeys: editableRowKey,
        onChange: setRowKeys,
        actionRender: (row, config, defaultDoms) => {
          return [defaultDoms.delete]
        },
        onValuesChange: (record, recordList) => {
          onChange?.(recordList)
        },
      }}
      {...restProps}
    />
  )
}

export default BsEditTable
