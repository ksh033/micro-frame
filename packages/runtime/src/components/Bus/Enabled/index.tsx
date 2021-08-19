import React, { useState, useMemo, useEffect } from 'react'
import { Switch } from 'antd'
import { BsTableComponentProps } from '../../Base/BsTable'
import { SwitchChangeEventHandler } from 'antd/es/switch'
import { useRequest } from 'ahooks'
import { CModal } from '@scboson/sc-element'
import Authority from '../../Auth/Authority'

type EnabledProps = BsTableComponentProps & {
  request: (params: any) => Promise<any> // 请求数据的远程方法
  rowKeyName?: string
  warning?: string
  enabledName?: string;
  funcode?:string;
  disabled?:boolean;
  disabledCallback?: (rowData: any) => boolean
}

const Enabled: React.FC<EnabledProps> = (props) => {
  const {
    request,
    rowKeyName = 'id',
    value,
    rowData,
    warning = '',
    enabledName = 'enabled',
    disabled,
    disabledCallback,
  } = props
  const { loading, run } = useRequest(request, {
    manual: true,
  })
  const [state, setState] = useState<boolean>(!!value)

  useEffect(() => {
    setState(value)
  }, [value])

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
            [enabledName]: checked,
          }).then((data) => {
            setState(checked)
            rowData[enabledName]=checked
            return data
          })
        },
      })
    } else {
      run({
        [rowKeyName]: rowData[rowKeyName],
        [enabledName]: checked,
      }).then(() => {
        setState(checked)
        rowData[enabledName]=checked
      })
    }
  }

  let backDisabled:any = useMemo(() => {
    return disabledCallback ? disabledCallback(rowData) : false
  }, [disabledCallback, JSON.stringify(rowData)])

  if (disabled!==undefined||disabled!==null){
    backDisabled=disabled
  }
  return (
    <Switch
      checkedChildren="启用"
      unCheckedChildren="禁用"
      checked={state}
      onChange={handleChange}
      loading={loading}
      disabled={disabled}
    />
  )
}

export default Authority(Enabled,"Enabled")
