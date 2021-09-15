/* eslint-disable no-new */
import React, { useRef, useState } from 'react'
import { useThrottle, useUpdateEffect } from 'ahooks'
import { Input } from 'antd'
import { Map } from 'react-amap'
import styles from './index.less'

const SearchMap = (props: any) => {
  const { pageProps } = props
  const { dataChange, inputValue, cityCode } = pageProps

  const map = useRef<any>(null)
  const placeSearch = useRef<any>(null)
  const [mapCenter, setMapCenter] = useState<any>(null)
  const [city, setCity] = useState<string>(cityCode || '350100')

  const [value, setValue] = useState<string>()
  const throttledValue = useThrottle(value, { wait: 500 })

  useUpdateEffect(() => {
    if (throttledValue && throttledValue !== '' && placeSearch.current) {
      placeSearch.current.search(throttledValue)
    }
  }, [throttledValue])

  const formatValue = (_value: any) => {
    if (_value) {
      const name = _value['name'] || ''
      const cityName = _value['cityname'] || ''
      const pname = _value['pname'] || ''
      const adname = _value['adname'] || ''
      const address = _value['address'] || ''

      return pname + cityName + adname + address + name
    }
    return ''
  }

  const mapEvents = {
    created: (ins: any) => {
      map.current = ins

      if (window.AMap) {
        window.AMap.service(['AMap.PlaceSearch'], () => {
          // 构造地点查询类
          placeSearch.current = new window.AMap.PlaceSearch({
            pageSize: 4, // 单页显示结果条数
            pageIndex: 1, // 页码
            city, // 兴趣点城市
            citylimit: false, // 是否强制限制在设置的城市内搜索
            map: ins, // 展现结果的地图实例
            panel: 'panel', // 结果列表将在此容器中进行展示。
            autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
          })
          // 关键字查询
          if (formatValue(inputValue) !== '') {
            setValue(formatValue(inputValue))
          }
          placeSearch.current.on('listElementClick', (params: any) => {
            if (params['data']) {
              dataChange && dataChange(params['data'])
            }
          })
        })
        if (cityCode) {
          window.AMap.plugin('AMap.DistrictSearch', () => {
            const districtSearch = new window.AMap.DistrictSearch({
              // 关键字对应的行政区级别，country表示国家
              level: 'city',
              //  显示下级行政区级数，1表示返回下一级行政区
              subdistrict: 0,
              showbiz: false,
              extensions: false,
            })

            // 搜索所有省/直辖市信息
            districtSearch.search(cityCode, (status: string, result: any) => {
              if (status === 'complete') {
                if (
                  Array.isArray(result.districtList) &&
                  result.districtList.length > 0
                ) {
                  const cityItem = result.districtList[0]
                  setCity(cityItem['citycode'])
                  setMapCenter({
                    longitude: cityItem.center['lng'],
                    latitude: cityItem.center['lat'],
                  })
                }
              } else {
                setCity('350100')
                setMapCenter({
                  longitude: 119.330221107,
                  latitude: 26.0471254966,
                })
              }
              // 查询成功时，result即为对应的行政区信息
            })
          })
        } else {
          window.AMap.plugin('AMap.Geolocation', () => {
            const geolocation = new window.AMap.Geolocation({
              // 是否使用高精度定位，默认：true
              enableHighAccuracy: true,
              // 设置定位超时时间，默认：无穷大
              timeout: 10000,
              // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
              buttonOffset: new window.AMap.Pixel(10, 20),
              //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              zoomToAccuracy: true,
              //  定位按钮的排放位置,  RB表示右下
              buttonPosition: 'RB',
            })

            geolocation.getCurrentPosition()
            window.AMap.event.addListener(geolocation, 'complete', onComplete)
            window.AMap.event.addListener(geolocation, 'error', onError)

            function onComplete(_data: any) {
              setCity(_data['addressComponent']['citycode'])
              setMapCenter({
                longitude: _data.position['lng'] || '119.330221107',
                latitude: _data.position['lat'] || '26.0471254966',
              })
              // data是具体的定位信息
            }

            function onError(_data: any) {
              setCity('350100')
              setMapCenter({
                longitude: 119.330221107,
                latitude: 26.0471254966,
              })
            }
          })
        }
      }
    },
  }

  return (
    <div className={styles['map-div']}>
      <Map center={mapCenter} events={mapEvents}></Map>
      <div id="panel" className={styles['map-panel']}></div>
      <Input
        placeholder="输入查询"
        className={styles['map-input']}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  )
}

export default SearchMap
