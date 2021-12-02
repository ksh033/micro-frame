/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useCallback } from 'react'
import { Button, Input } from 'antd'
import { Map, Polygon, PolyEditor, PolygonPath, Marker } from 'react-amap'
import { useMap, useFullscreen, useSetState, useUpdateEffect } from 'ahooks'
import { getCenterOfGravityPoint, colorRgba } from '../../../utils/common'
import compute from '../../../utils/compute'
import {
  CloseCircleOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons'
import styles from './index.less'
import { CModal } from '@scboson/sc-element'

const colorList = [
  '#096dd9',
  '#d4b106',
  '#389e0d',
  '#d46b08',
  '#cf1322',
  '#08979c',
  '#531dab',
  '#c41d7f',
  '#d48806',
  '#7cb305',
  '#7cb305',
  '#1d39c4',
]

export interface RailItemProps {
  path: PolygonPath
  title?: string
  color?: string
}

interface RailProps {
  value?: RailItemProps[]
  onChange?: (list: RailItemProps[]) => void
  distance?: number // 单位米
  initMarker?: { px: number; py: number } // 初始化的点
}

interface RailState {
  maxSize: number
  active: string
}

function GenNonDuplicateID(randomLength: number | undefined) {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3, randomLength)
  return idStr
}

export default (props: RailProps) => {
  const {
    initMarker = { px: 119.330221, py: 26.0471254 },
    distance = 3000,
    onChange,
    value,
  } = props
  const mapPlugins: any[] = ['ToolBar', 'Scale']
  const map = useRef<any>(null)
  const [overlays, overlaysMap] = useMap<
    string | number,
    {
      path: PolygonPath
      color: string
    }
  >([])
  const [editor, editorMap] = useMap<string | number, any>([])

  const [titleMap, titleMapFn] = useMap<string | number, string>([])
  const [mapCenter, setMapCenter] = useState({
    longitude: 119.330221,
    latitude: 26.0471254,
  })

  const fullRef = useRef<any>()
  const [isFullscreen, { toggleFull }] = useFullscreen(fullRef)

  const [state, setState] = useSetState<RailState>({
    maxSize: 0,
    active: '',
  })

  const formatPxPy = (list: any[]): any[] => {
    if (Array.isArray(list)) {
      return list.map((item) => {
        return {
          px: item['longitude'],
          py: item['latitude'],
        }
      })
    } else {
      return []
    }
  }

  const formatList = () => {
    const list: any[] = []
    Array.from(overlays).forEach((item: any) => {
      const title = titleMapFn.get(item[0])
      list.push({
        path: formatPxPy(item[1].path),
        title,
        color: item[1].color,
      })
    })

    onChange && onChange(list)
  }

  // 输入事件
  const handleChange = (target: { value: string; key: string }) => {
    const item: any = titleMapFn.get(target.key)
    if (item !== null || item !== undefined) {
      titleMapFn.set(target.key, target.value)
      // overlaysMap.set(target.key, item);
    }
  }

  const formatLngLat = (list: any[]): PolygonPath => {
    if (Array.isArray(list)) {
      return list.map((item) => {
        return {
          longitude: item['lng'] || item['px'],
          latitude: item['lat'] || item['py'],
        }
      })
    } else {
      return []
    }
  }

  useUpdateEffect(() => {
    formatList()
  }, [
    JSON.stringify(Array.from(overlays)),
    JSON.stringify(Array.from(titleMap)),
  ])

  useUpdateEffect(() => {
    if (Array.isArray(value) && Array.from(overlays).length === 0) {
      overlaysMap.reset()
      titleMapFn.reset()
      let activeKey = ''
      value.forEach((item, index: number) => {
        const key = GenNonDuplicateID(10)
        if (index === 0) {
          activeKey = key
        }
        overlaysMap.set(key, {
          path: formatLngLat(item.path),
          color: colorList[index % 12],
        })
        titleMapFn.set(key, item.title || '')
      })

      setState({
        maxSize: value.length,
        active: activeKey,
      })
    }
  }, [JSON.stringify(value)])

  const addPolygon = () => {
    const marker = initMarker
    const real: number = compute.multiply(0.00001, distance)
    const maxSize = state.maxSize + 1
    const key = GenNonDuplicateID(10)
    if (marker.px && marker.py) {
      const leftTop = {
        longitude: compute.subtract(marker.px, real),
        latitude: marker.py + real,
      }
      const rightTop = {
        longitude: compute.add(marker.px, real),
        latitude: compute.add(marker.py, real),
      }
      const leftBottom = {
        longitude: compute.subtract(marker.px, real),
        latitude: compute.subtract(marker.py, real),
      }
      const rightBottom = {
        longitude: compute.add(marker.px, real),
        latitude: compute.subtract(marker.py, real),
      }
      overlaysMap.set(key, {
        path: [leftTop, rightTop, rightBottom, leftBottom],
        color: colorList[(maxSize - 1) % 12],
      })
      titleMapFn.set(key, '')
      setState({
        maxSize,
        active: key,
      })
    }
  }

  useUpdateEffect(() => {
    if (initMarker.px && initMarker.py) {
      setMapCenter({
        longitude: initMarker.px,
        latitude: initMarker.py,
      })
    }
  }, [JSON.stringify(initMarker)])

  const mapEvents = {
    created: (ins: any) => {
      map.current = ins
    },
  }

  const editorEvents = {
    created: (ins: any) => {
      console.log(ins)
      let extData: any = null
      if (ins.Rc && ins.Rc.getExtData) {
        extData = ins.Rc.getExtData()
      }

      if (ins.Sc && ins.Sc.De && ins.Sc.De.extData) {
        extData = ins.Sc.De.extData
      }
      if (!editorMap.get(extData) && extData !== null) {
        editorMap.set(extData, ins)
      }
      const center = getCenterOfGravityPoint(ins.Sc.De.path)
      setMapCenter(center)
    },
    adjust: ({ target }: any) => {
      const key = target.getExtData()
      const obj: any = overlaysMap.get(key)
      if (obj) {
        obj.path = formatLngLat(target.getPath())
        overlaysMap.set(key, obj)
      }
    },
  }

  const changeActive = (key: any) => {
    setState({
      active: key,
    })
  }

  function removeNode(key: any) {
    CModal.confirm({
      title: '您是否确定删除该围栏',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async (res: any) => {
        const remvoeObj = overlaysMap.get(key)
        if (remvoeObj) {
          overlaysMap.remove(key)
          titleMapFn.remove(key)
          const editRemoveObj = editorMap.get(key)
          if (editRemoveObj) {
            editRemoveObj.close()
            editorMap.remove(key)
          }
          const newActive: any = Array.from(overlays)[0]
          if (newActive) {
            setState({
              active: newActive[0],
            })
          }
        }
      },
    })
  }

  // 地图内的多边形生成
  const getPolyEditor = useCallback(() => {
    const polyEditors: React.ReactNode[] = []
    Array.from(overlays).forEach((item: any) => {
      const path = JSON.parse(JSON.stringify(item[1].path))
      const key = item[0]
      const _color = item[1].color
      const style = {
        strokeColor: _color,
        strokeWeight: 2,
        fillOpacity: 0.2,
        fillColor: _color,
        extData: key,
      }
      const active = state.active === key
      polyEditors.push(
        <Polygon path={path} key={key} style={style}>
          <PolyEditor
            key={`${key}_editor`}
            events={editorEvents}
            active={active}
          />
        </Polygon>
      )
    })
    return polyEditors
  }, [JSON.stringify(overlays), state.active])
  // 左上角浮层
  const getCardList = () => {
    const list: React.ReactNode[] = []
    Array.from(titleMap).forEach((item: any, index: number) => {
      const active = state.active === item[0]
      const oitem: any = overlaysMap.get(item[0])
      const _style = {
        backgroundColor: colorRgba(oitem.color, 0.4),
        border: `1px solid ${oitem.color}`,
      }
      const mainStyle = active
        ? {
            border: '1px solid #155bD4',
          }
        : {}
      list.push(
        <div
          className={styles['rail-item']}
          key={index}
          style={mainStyle}
          onClick={() => {
            changeActive(item[0])
          }}
        >
          <div className={styles['rail-item-color']} style={_style}></div>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChange({
                value: e.target.value,
                key: item[0],
              })
            }}
            value={item[1]}
          ></Input>
          <Button
            className={styles['rail-item-remove']}
            type="link"
            onClick={() => {
              removeNode(item[0])
            }}
          >
            <CloseCircleOutlined />
          </Button>
          {active ? <div className={styles['rail-item-active']}></div> : null}
        </div>
      )
    })
    return list
  }

  return (
    <div className={styles['rail-map']} ref={fullRef}>
      <Map center={mapCenter} events={mapEvents} zoom={13} plugins={mapPlugins}>
        {getPolyEditor()}
        <Marker
          position={{
            longitude: initMarker.px,
            latitude: initMarker.py,
          }}
        />
      </Map>
      <div className={styles['rail-content']}>
        <div className={styles['rail-card-list']}>{getCardList()}</div>
        <div className={styles['rail-add']}>
          <Button block onClick={addPolygon}>
            添加配送区域
          </Button>
        </div>
      </div>
      <div className={styles['rail-fullbtn']} onClick={toggleFull}>
        {isFullscreen ? (
          <FullscreenExitOutlined style={{ fontSize: '24px' }} />
        ) : (
          <FullscreenOutlined style={{ fontSize: '24px' }} />
        )}
      </div>
    </div>
  )
}
