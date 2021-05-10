import React, { useRef } from 'react'
import { Input } from 'antd'
import Map from './Map'
import { CModal } from '@scboson/sc-element'

export interface LocationDataProps {
  name: string // 具体地址
  px: number // 经度
  py: number // 纬度
  cityCode?: string // 城市编码
}

interface LocationSearchProps {
  placeholder?: string
  value?: LocationDataProps
  title?: string
  city?: string
  onChange?: (value: LocationDataProps) => void
}

const LocationSearch: React.FC<LocationSearchProps> = (
  props: LocationSearchProps
) => {
  const { placeholder, onChange, value, title = '选择', city } = props

  const data = useRef<any>(null)

  const dataChange = (_data: any) => {
    data.current = _data
  }

  const dataFormat = (currentData: any): LocationDataProps => {
    if (currentData) {
      const name = currentData['name'] || ''
      const cityName = currentData['cityname'] || ''
      const adname = currentData['adname'] || ''
      const address = currentData['address'] || ''

      const newName = cityName + adname + address + name
      return {
        name: newName,
        px: currentData.location['lng'],
        py: currentData.location['lat'],
        cityCode: currentData.adcode,
      }
    } else {
      return {
        name: '',
        px: 0,
        py: 0,
      }
    }
  }

  const handleClick = () => {
    CModal.show({
      title,
      width: '1200px',
      content: Map,
      pageProps: {
        dataChange,
        inputValue: value,
        cityCode: city,
      },
      onOk: async () => {
        onChange && onChange(dataFormat(data.current))
      },
    })
  }

  const valueFormat = (_value: any) => {
    if (_value) {
      return _value['name'] || ''
    }
    return ''
  }

  return (
    <div onClick={handleClick}>
      <Input placeholder={placeholder} readOnly value={valueFormat(value)} />
    </div>
  )
}

export default LocationSearch
