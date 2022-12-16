/* eslint-disable max-len */

import React, { useMemo } from 'react'
import { ScSelect } from '@scboson/sc-element'
import type { ScSelectProps } from '@scboson/sc-element/es/sc-select'
import { uesRequest } from '../../../utils/api'

type bizDeptType = 'COMPANY' | 'CHAIN_MANAGE_COMPANY' | 'SUPPLY_CHAIN_COMPANY' | 'SUPPLY_SUBCOMPANY' | 'SHOP' | 'WAREHOUSE' | 'SUPPLIER'

interface OrgSelectProps extends ScSelectProps {
  limit?: number
  bizDeptTypes: bizDeptType[]
}

const OrgSelect: React.FC<OrgSelectProps> = (props) => {
  const { run } = uesRequest('system', 'bizdept')
  const { bizDeptTypes, limit, ...resProps } = props

  const innerBizDeptTypes = Array.isArray(bizDeptTypes) ? bizDeptTypes : []

  const bizDeptTypesStr = JSON.stringify(innerBizDeptTypes)

  const params = useMemo(
    () => ({
      size: props.limit || 999,
      bizDeptTypes: innerBizDeptTypes,
    }),
    [limit, bizDeptTypesStr]
  )

  return (
    <ScSelect
      request={run}
      showSearch
      labelInValue
      searchField="bizDeptCodeOrName"
      textField="bizDeptName"
      valueField="bizDeptId"
      params={params}
      remoteSearch={true}
      allowClear
      autoload={true}
      filterOption={false}
      defaultActiveFirstOption={false}
      group={innerBizDeptTypes.length > 1}
      {...resProps}
    ></ScSelect>
  )
}

export default OrgSelect
