import React, { useEffect, useMemo, useState } from 'react'
import { ScTree } from '@scboson/sc-element'
import { useServiceRequest } from '@micro-frame/sc-runtime'
import { Key } from 'antd/es/table/interface'

type SysPermListProps = {
  systemCode: string
  bizDeptId: string
  value: React.Key[]
  onChange?: (val: React.Key[]) => void
}

const SysPermList: React.FC<SysPermListProps> = (props) => {
  const { run } = useServiceRequest('role', 'getPermTree')
  const { systemCode, bizDeptId, value, onChange } = props
  const show = useMemo(() => {
    return systemCode && bizDeptId
  }, [systemCode, bizDeptId])

  const [selectedKeys, setSelectedKeys] = useState<Key[]>([])

  const params = useMemo(() => {
    return {
      systemCode: systemCode,
      deptId: bizDeptId,
    }
  }, [systemCode, bizDeptId])

  useEffect(() => {
    if (Array.isArray(value) && selectedKeys.length === 0) {
      const selectKeys: Key[] = []
      value.forEach((item: any) => {
        if (typeof item === 'object') {
          selectKeys.push(item.functionPermId)
        } else {
          selectKeys.push(item)
        }
      })
      onChange && onChange(selectKeys)
      setSelectedKeys(selectKeys)
    }
  }, [JSON.stringify(value)])

  const onCheck = (
    checked:
      | {
          checked: Key[]
          halfChecked: Key[]
        }
      | Key[],
    e: any
  ) => {
    if (Array.isArray(checked) && Array.isArray(e.checkedNodes)) {
      const rCheckeds = e.checkedNodes
        .filter((item: any) => item.isLeaf)
        .map((item: any) => {
          return item.key
        })
      onChange && onChange(rCheckeds)
      setSelectedKeys(rCheckeds)
    }
  }
  const isLeafFormat = (data: any) => {
    return data.leafFlag
  }
  return show ? (
    <ScTree
      checkable
      canSearch={false}
      placeholder={'search'}
      onSearch={(value: any) => {
        console.log(`the search value is ${value}`)
      }}
      isLeafFormat={isLeafFormat}
      defaultExpandParent
      textField="name"
      valueField="functionPermId"
      params={params}
      autoload={true}
      request={run}
      onCheck={onCheck}
      checkedKeys={selectedKeys}
    />
  ) : null
}

export default SysPermList
