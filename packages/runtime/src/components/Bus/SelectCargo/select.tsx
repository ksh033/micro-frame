/* eslint-disable max-len */

import React, { useRef, useEffect, useMemo } from 'react'
import { uesRequest } from '../../../utils/api'
import { ScSelect } from '@scboson/sc-element'
import { ScSelectProps } from '@scboson/sc-element/lib/sc-select'

interface TableSelectProps extends ScSelectProps {
  limit?: number
}

const CargoSelect: React.FC<TableSelectProps> = (props) => {
  const { run } = uesRequest('cargo', 'list')

  const params = useMemo(
    () => ({
      size: props.limit || 15,
    }),
    [props.limit]
  )

  return (
    <ScSelect
      {...props}
      request={run}
      showSearch
      labelInValue
      searchField="cargoName"
      textField="cargoName"
      valueField="cargoId"
      params={params}
      remoteSearch={true}
      allowClear
      openReloadData
    ></ScSelect>
  )
}

export default CargoSelect
