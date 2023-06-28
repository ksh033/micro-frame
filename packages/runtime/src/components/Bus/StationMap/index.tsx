/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import { uesRequest } from '../../../utils/api'
import {
  CloseCircleOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { CModal } from '@scboson/sc-element';
import { useFullscreen, useMap, useSetState, useThrottle, useUpdateEffect } from 'ahooks';
import { Button, Input } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Marker, PolyEditor, Polygon, PolygonPath, } from 'react-amap';
import { colorRgba, getCenterOfGravityPoint } from '../../../utils/common';
import compute from '../../../utils/compute';
import ReactAmapMap from '../ReactAmapMap';
import styles from './index.less';

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
];

export interface RailItemProps {
  path: PolygonPath;
  title?: string;
  color?: string;
}

interface RailProps {
  value?: RailItemProps[];
  onChange?: (list: RailItemProps[]) => void;
  distance?: number; // 单位米
  initMarker?: { px: number; py: number }; // 初始化的点
  cityCode?: any
  rowKey?: any
}

interface RailState {
  maxSize: number;
  active: string;
}

function GenNonDuplicateID(randomLength: number | undefined) {
  let idStr = Date.now().toString(36);
  idStr += Math.random().toString(36).substr(3, randomLength);
  return idStr;
}

export default (props: RailProps) => {
  const {
    initMarker = { px: 119.330221, py: 26.0471254 },
    distance = 3000,
    onChange,
    value,
    cityCode,
    rowKey = 'stationId'
  } = props;

  const { run } = uesRequest('system', 'getStationMapList')
  const [dataSource, setDataSource] = useState<any>([]);

  const mapPlugins: any[] = ['ToolBar', 'Scale'];
  const map = useRef<any>(null);

  const [overlays, overlaysMap] = useMap<
    string | number,
    {
      path: PolygonPath;
      color: string;
    }
  >([]);

  const [stations, stationsMap] = useMap<
    string | number,
    {
      scopes: any[],
      color: string,
      px: any,
      py: any,
    }
  >([]);

  const [editor, editorMap] = useMap<string | number, any>([]);
  const [titleMap, titleMapFn] = useMap<string | number, string>([]);
  const [mapCenter, setMapCenter] = useState({
    longitude: 119.330221,
    latitude: 26.0471254,
  });

  const fullRef = useRef<any>();

  const placeSearch = useRef<any>(null);
  const [city, setCity] = useState<string>(cityCode || '350100');
  const [inputVal, setInputVal] = useState<string>();
  const throttledValue = useThrottle(inputVal, { wait: 500 });


  useEffect(() => {
    run().then((res: any) => {
      if (res) {
        setDataSource(res)
      }
    })
  }, [])


  useUpdateEffect(() => {
    if (throttledValue && throttledValue !== '' && placeSearch.current) {
      placeSearch.current.search(throttledValue);
    }
  }, [throttledValue]);
  const [isFullscreen, { toggleFull }] = useFullscreen(fullRef);

  const [state, setState] = useSetState<RailState>({
    maxSize: 0,
    active: '',
  });

  const formatPxPy = (list: any[]): any[] => {
    if (Array.isArray(list)) {
      return list.map((item) => {
        return {
          px: item['longitude'],
          py: item['latitude'],
        };
      });
    } else {
      return [];
    }
  };

  const formatList = () => {
    const list: any[] = [];
    Array.from(overlays).forEach((item: any) => {
      const title = titleMapFn.get(item[0]);
      list.push({
        path: formatPxPy(item[1].path),
        title,
        color: item[1].color,
      });
    });

    onChange && onChange(list);
  };

  // 输入事件
  const handleChange = (target: { value: string; key: string }) => {
    const item: any = titleMapFn.get(target.key);
    if (item !== null || item !== undefined) {
      titleMapFn.set(target.key, target.value);
      // overlaysMap.set(target.key, item);
    }
  };

  const formatLngLat = (list: any[]): PolygonPath => {
    if (Array.isArray(list)) {
      return list.map((item) => {
        return {
          longitude: item['lng'] || item['px'],
          latitude: item['lat'] || item['py'],
        };
      });
    } else {
      return [];
    }
  };

  useUpdateEffect(() => {
    formatList();
  }, [
    JSON.stringify(Array.from(overlays)),
    JSON.stringify(Array.from(titleMap)),
  ]);

  useEffect(() => {
    if (Array.isArray(dataSource) && Array.from(stations).length === 0) {
      stationsMap.reset();
      titleMapFn.reset();
      let activeKey = '';
      dataSource.forEach((item, index: number) => {
        const key = item[rowKey];
        stationsMap.set(key, {
          scopes: item.serviceScopes,
          color: colorList[index % 12],
          px: item.px,
          py: item.py,
        });
        titleMapFn.set(key, item.stationName || '');

        item.serviceScopes.forEach((it) => {
          const layoutKey = GenNonDuplicateID(10)
          if (index === 0) {
            activeKey = layoutKey;
          }
          overlaysMap.set(layoutKey, {
            path: formatLngLat(it.scopePts),
            color: colorList[index % 12],
          });
        })

      });

      setState({
        maxSize: dataSource.length,
        active: activeKey,
      });
    }
  }, [JSON.stringify(dataSource)]);
  console.log(overlays);

  const addPolygon = () => {
    const marker = initMarker;
    const real: number = compute.multiply(0.00001, distance);
    const maxSize = state.maxSize + 1;
    const key = GenNonDuplicateID(10);
    if (marker.px && marker.py) {
      const leftTop = {
        longitude: compute.subtract(marker.px, real),
        latitude: marker.py + real,
      };
      const rightTop = {
        longitude: compute.add(marker.px, real),
        latitude: compute.add(marker.py, real),
      };
      const leftBottom = {
        longitude: compute.subtract(marker.px, real),
        latitude: compute.subtract(marker.py, real),
      };
      const rightBottom = {
        longitude: compute.add(marker.px, real),
        latitude: compute.subtract(marker.py, real),
      };
      overlaysMap.set(key, {
        path: [leftTop, rightTop, rightBottom, leftBottom],
        color: colorList[(maxSize - 1) % 12],
      });
      titleMapFn.set(key, '');
      setState({
        maxSize,
        active: key,
      });
    }
  };

  useUpdateEffect(() => {
    if (initMarker.px && initMarker.py) {
      setMapCenter({
        longitude: initMarker.px,
        latitude: initMarker.py,
      });
    }
  }, [JSON.stringify(initMarker)]);


  const formatValue = (_value: any) => {
    if (_value) {
      const name = _value['name'] || '';
      const cityName = _value['cityname'] || '';
      const pname = _value['pname'] || '';
      const adname = _value['adname'] || '';
      const address = _value['address'] || '';

      return pname + cityName + adname + address + name;
    }
    return '';
  };

  const mapEvents = {
    created: (ins: any) => {
      map.current = ins;
      if (window.AMap) {
        console.log('window.AMap', window.AMap);
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
          });
          // 关键字查询
          if (formatValue(inputVal) !== '') {
            setInputVal(formatValue(inputVal));
          }
        });
        if (cityCode) {
          window.AMap.plugin('AMap.DistrictSearch', () => {
            const districtSearch = new window.AMap.DistrictSearch({
              // 关键字对应的行政区级别，country表示国家
              level: 'city',
              //  显示下级行政区级数，1表示返回下一级行政区
              subdistrict: 0,
              showbiz: false,
              extensions: false,
            });

            // 搜索所有省/直辖市信息
            districtSearch.search(cityCode, (status: string, result: any) => {
              if (status === 'complete') {
                if (
                  Array.isArray(result.districtList) &&
                  result.districtList.length > 0
                ) {
                  const cityItem = result.districtList[0];
                  setCity(cityItem['citycode']);
                  setMapCenter({
                    longitude: cityItem.center['lng'],
                    latitude: cityItem.center['lat'],
                  });
                }
              } else {
                setCity('350100');
                setMapCenter({
                  longitude: 119.330221107,
                  latitude: 26.0471254966,
                });
              }
              // 查询成功时，result即为对应的行政区信息
            });
          });
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
            });

            geolocation.getCurrentPosition();
            window.AMap.event.addListener(geolocation, 'complete', onComplete);
            window.AMap.event.addListener(geolocation, 'error', onError);

            function onComplete(_data: any) {
              setCity(_data['addressComponent']['citycode']);
              setMapCenter({
                longitude: _data.position['lng'] || '119.330221107',
                latitude: _data.position['lat'] || '26.0471254966',
              });
              // data是具体的定位信息
            }

            function onError(_data: any) {
              setCity('350100');
              setMapCenter({
                longitude: 119.330221107,
                latitude: 26.0471254966,
              });
            }
          });
        }
      }
    }
  };

  const editorEvents = {
    created: (ins: any) => {
      let extData: any = null;
      if (ins.Rc && ins.Rc.getExtData) {
        extData = ins.Rc.getExtData();
      }

      if (ins.Sc && ins.Sc.De && ins.Sc.De.extData) {
        extData = ins.Sc.De.extData;
      }
      if (!editorMap.get(extData) && extData !== null) {
        editorMap.set(extData, ins);
      }
      const center = getCenterOfGravityPoint(ins.Sc.De.path);
      setMapCenter(center);
    },
    adjust: ({ target }: any) => {
      const key = target.getExtData();
      const obj: any = overlaysMap.get(key);
      if (obj) {
        obj.path = formatLngLat(target.getPath());
        overlaysMap.set(key, obj);
      }
    },
  };

  const event = {
    mouseup: ({ target }: any) => {
      const key = target.getExtData();
      const obj: any = overlaysMap.get(key);
      if (obj) {
        obj.path = formatLngLat(target.getPath());
        overlaysMap.set(key, obj);
      }
    },
  };

  const changeActive = (key: any) => {
    setState({
      active: key,
    });
  };

  function removeNode(key: any) {
    CModal.confirm({
      title: '您是否确定删除该围栏',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async (res: any) => {
        const remvoeObj = overlaysMap.get(key);
        if (remvoeObj) {
          overlaysMap.remove(key);
          titleMapFn.remove(key);
          const editRemoveObj = editorMap.get(key);
          if (editRemoveObj) {
            editRemoveObj.close();
            editorMap.remove(key);
          }
          const newActive: any = Array.from(overlays)[0];
          if (newActive) {
            setState({
              active: newActive[0],
            });
          }
        }
      },
    });
  }

  // 地图内的多边形生成
  const getPolyEditor = useCallback(() => {
    const polyEditors: React.ReactNode[] = [];
    Array.from(stations).forEach((item: any) => {
      const overlays = item[1].scopes
      const key = item[0];
      const _color = item[1].color;
      const style = {
        strokeColor: _color,
        strokeWeight: 2,
        fillOpacity: 0.2,
        fillColor: _color,
        extData: key,
      };
      const active = state.active === key;
      overlays.forEach((it: any, index: any) => {
        const path = JSON.parse(JSON.stringify(formatLngLat(it.scopePts)));
        polyEditors.push(
          <Polygon path={path} key={`${key}_${index}`} style={style} events={event}>
            {/* <PolyEditor
              key={`${index}`}
              events={editorEvents}
              active={active}
            /> */}
          </Polygon>
        );
      })
    });
    return polyEditors;
  }, [JSON.stringify(stations), state.active]);

  // 围栏内站点标记生成
  const getMarker = useCallback(() => {
    const Markers: React.ReactNode[] = [];
    Array.from(stations).forEach((item: any) => {
      const key = item[0];
      if (window.AMap) {
        const Icon = new window.AMap.Icon({
          image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
          size: new window.AMap.Size(30, 40),
          imageSize: new window.AMap.Size(30, 40)
        })
        Markers.push(
          <Marker
            icon={Icon}
            label={{ content: titleMapFn.get(key), direction: 'bottom' }}
            position={{
              longitude: item[1].px,
              latitude: item[1].py,
            }}
          />
        );
      }
    });
    return Markers;
  }, [JSON.stringify(overlays), state.active]);
  // 左上角浮层
  const getCardList = () => {
    const list: React.ReactNode[] = [];
    Array.from(titleMap).forEach((item: any, index: number) => {
      const active = state.active === item[0];
      const oitem: any = overlaysMap.get(item[0]);
      let _style = {};
      if (oitem) {
        _style = {
          backgroundColor: colorRgba(oitem.color, 0.4),
          border: `1px solid ${oitem.color}`,
        };
      }
      const mainStyle = active
        ? {
          border: '1px solid #155bD4',
        }
        : {};
      list.push(
        <div
          className={styles['rail-item']}
          key={index}
          style={mainStyle}
          onClick={() => {
            changeActive(item[0]);
          }}
        >
          <div className={styles['rail-item-color']} style={_style}></div>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChange({
                value: e.target.value,
                key: item[0],
              });
            }}
            value={item[1]}
          ></Input>
          <Button
            className={styles['rail-item-remove']}
            type="link"
            onClick={() => {
              removeNode(item[0]);
            }}
          >
            <CloseCircleOutlined />
          </Button>
          {active ? <div className={styles['rail-item-active']}></div> : null}
        </div>
      );
    });
    return list;
  };

  return (
    <div className={styles['rail-map']} ref={fullRef}>
      <ReactAmapMap
        center={mapCenter}
        events={mapEvents}
        zoom={13}
        plugins={mapPlugins}
      >
        {getPolyEditor()}
        {getMarker()}
      </ReactAmapMap>
      {inputVal ? <div id="panel" className={styles['map-panel']}></div> : null}
      <div className={styles['rail-content']}>
        <Input
          placeholder="输入查询"
          className={styles['map-input']}
          onChange={(e) => setInputVal(e.target.value)}
          value={inputVal}
        />
        {/* <div className={styles['rail-card-list']}>{getCardList()}</div>
        <div className={styles['rail-add']}>
          <Button block onClick={addPolygon}>
            添加配送区域
          </Button>
        </div> */}
      </div>
      <div className={styles['rail-fullbtn']} onClick={toggleFull}>
        {isFullscreen ? (
          <FullscreenExitOutlined style={{ fontSize: '24px' }} />
        ) : (
          <FullscreenOutlined style={{ fontSize: '24px' }} />
        )}
      </div>
    </div>
  );
};
