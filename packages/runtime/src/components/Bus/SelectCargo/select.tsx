/* eslint-disable max-len */

import React, { useRef, useEffect, useMemo } from 'react'
import { uesRequest } from '../../../utils/api'
import { ScSelect } from '@scboson/sc-element'
import { ScSelectProps } from '@scboson/sc-element/es/sc-select'
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
      params={params}
      remoteSearch={true}
      showSearch={true}
      autoload={true}
      searchField="cargoName"
      textField="cargoName"
      valueField="cargoId"
      labelInValue
      filterOption={false}
      allowClear
      defaultActiveFirstOption={false}
    ></ScSelect>
  )
}

export default CargoSelect
