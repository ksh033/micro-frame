import React, { useState } from 'react'
import { Switch } from 'antd'
import { BsTableComponentProps } from '../../Base/BsTable'
import { SwitchChangeEventHandler } from 'antd/lib/switch'
import { useRequest } from 'ahooks'
import { CModal } from '@scboson/sc-element'

type EnabledProps = BsTableComponentProps & {
  request: (params: any) => Promise<any> // 请求数据的远程方法
  rowKeyName?: string
  warning?: string
}

const Enabled: React.FC<EnabledProps> = (props) => {
  const { request, rowKeyName = 'id', value, rowData, warning = '' } = props
  const { loading, run } = useRequest(request, {
    manual: true,
  })
  const [state, setState] = useState<boolean>(!!value)

  const handleChange: SwitchChangeEventHandler = (checked: boolean) => {
    if (checked === false) {
      CModal.confirm({
        title: `${warning}您是否确定禁用?`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          return run({
            [rowKeyName]: rowData[rowKeyName],
          }).then((data) => {
            setState(checked)
            return data
          })
        },
      })
    } else {
      return run({
        [rowKeyName]: rowData[rowKeyName],
      }).then(() => {
        setState(checked)
      })
    }
  }

  return (
    <Switch
      checkedChildren="启用"
      unCheckedChildren="禁用"
      checked={state}
      onChange={handleChange}
      loading={loading}
    />
  )
}

export default Enabled
