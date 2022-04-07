import { Form, Radio, Tooltip } from 'antd'
import _ from 'lodash'
import React, { useMemo } from 'react'
import VdFormItem from '../VdFormItem'

const RadioIcon: React.FC<any> = (props) => {
  const { onChange, value, options, formItemTitle } = props

  const valueMap = useMemo(() => {
    const map = new Map()
    if (Array.isArray(options)) {
      options.forEach((it) => {
        map.set(it.value, it.text)
      })
    }
    return map
  }, [JSON.stringify(options)])

  return (
    <VdFormItem
      formItemTitle={formItemTitle}
      valueName={valueMap.get(value) ? valueMap.get(value) : ''}
    >
      <Radio.Group onChange={onChange} value={value} buttonStyle="solid">
        {options.map((it: any) => {
          return (
            <Tooltip
              title={it.text}
              key={`tooltip-${it.value}`}
              placement="bottom"
              color="#fff"
              overlayInnerStyle={{
                color: '#323233',
              }}
            >
              <Radio.Button value={it.value} key={it.value}>
                {it.icon ? React.createElement(it.icon, it.iconProps) : it.text}
              </Radio.Button>
            </Tooltip>
          )
        })}
      </Radio.Group>
    </VdFormItem>
  )
}

export default RadioIcon
