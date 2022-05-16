import { uesRequest } from '../../utils/api'
import { useCallback, useMemo } from 'react'
import { useSessionStorageState } from 'ahooks'
import { getAppCode } from '../Auth'

export interface DictDataItem {
  name: string
  value: any
}
export interface DictData {
  dictTypeCode: string
  dictValueId: string
  remark: string
  valueCode: string
  valueIndex: number
  valueName: string
}

export type DictMapData = {
  [key: string]: Array<DictDataItem>
  // items: Array<DictDataItem>;
} | null

export type LocalDictMapData = {
  [key: string]: Array<DictDataItem>
  // items: Array<DictDataItem>;
}

export default function useDictModel() {
  const [dict, setdDict] = useSessionStorageState<DictMapData>(
    'CG-CURRENT-DICT',
    {}
  )
  const [localDict, setdLocalDict] = useSessionStorageState<LocalDictMapData>(
    'CG-LOCAL-DICT',
    {}
  )


  const { run } = uesRequest('system', 'getDictTypeList')

  const loadDict = useCallback(async () => {
    if (dict == null || JSON.stringify(dict) === '{}') {
      const dictMapData = {}
      const result = await run()
      if (result) {
        result.forEach((item: DictData) => {

          const dictList = dictMapData[item.dictTypeCode]

          if (Array.isArray(dictList)) {
            dictMapData[item.dictTypeCode] = [
              ...dictList,
              {
                name: item.valueName,
                value: item.valueCode,
              },
            ]
          } else {
            dictMapData[item.dictTypeCode] = [
              {
                name: item.valueName,
                value: item.valueCode,
              },
            ]
          }
        })
        setdDict(dictMapData)
      }
      if (localDict == null || JSON.stringify(localDict) === '{}') {
        setdLocalDict({
          enabled: [
            {
              name: '启用',
              value: true,
            },
            {
              name: '禁用',
              value: false,
            },
          ],
          yesNo: [
            {
              name: '是',
              value: true,
            },
            {
              name: '否',
              value: false,
            },
          ],
          deptGoodsStatus: [
            {
              name: '上架',
              value: true,
            },
            {
              name: '下架',
              value: false,
            },
          ],
        })
      }
    }
  }, [dict, localDict])

  const setLocal = (type: string, list: Array<DictDataItem>) => {
    let localDictMap: LocalDictMapData = {}
    if (localDict !== undefined && JSON.stringify(localDict) !== '{}') {
      localDictMap = localDict
    }
    localDictMap[type] = list

    setdLocalDict(localDictMap)
  }

  const getDistList = (config: { dictTypeCode: string, localDict?: boolean }) => {
    let sysMap = config.localDict ? localDict : dict
    if (sysMap) {
      return sysMap[config.dictTypeCode]
    }
    return []
  }

  const getDictText = (
    config: { dictTypeCode: string },
    dictVal: any
  ) => {
    const distList = getDistList(config) || []
    const findItem = distList.find((item: any) => {
      return item.value === dictVal
    })
    if (findItem) {
      return findItem.name
    }
    return dictVal
  }

  return {
    dict: dict,
    loadDict,
    setLocal,
    getDistList,
    getDictText,
  }
}
