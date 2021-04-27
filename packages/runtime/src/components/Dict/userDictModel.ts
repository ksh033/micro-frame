import { uesRequest } from '../../utils/api'
import { useCallback, useMemo } from 'react'
import { useSessionStorageState } from 'ahooks'

export interface DictDataItem {
  name: string
  value: string
}
export interface DictData {
  dictTypeCode: string
  dictValueId: string
  remark: string
  systemCode: string
  valueCode: string
  valueIndex: number
  valueName: string
}

export type DictMapData = {
  [key: string]: {
    [key: string]: Array<DictDataItem>
  }
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

  const newDict = useMemo(() => {
    const newDict = dict || {}
    const newlocalDict = localDict || {}
    return {
      ...newDict,
      local: newlocalDict,
    }
  }, [dict, localDict])

  const { run } = uesRequest('system', 'getDictTypeList')

  const loadDict = useCallback(async () => {
    if (dict == null || JSON.stringify(dict) === '{}') {
      const dictMapData = {}
      const result = await run()
      if (result) {
        result.forEach((item: DictData) => {
          const sysMap = dictMapData[item.systemCode]

          const dictList = sysMap ? sysMap[item.dictTypeCode] : null

          if (Array.isArray(dictList)) {
            dictMapData[item.systemCode][item.dictTypeCode] = [
              ...dictList,
              {
                name: item.valueName,
                value: item.valueCode,
              },
            ]
          } else {
            dictMapData[item.systemCode] = {
              [item.dictTypeCode]: [
                {
                  name: item.valueName,
                  value: item.valueCode,
                },
              ],
            }
          }
        })
        setdDict(dictMapData)
      }
    }
  }, [dict])

  const setLocal = (type: string, list: Array<DictDataItem>) => {
    let localDictMap: LocalDictMapData = {}
    if (localDict !== undefined && JSON.stringify(localDict) !== '{}') {
      localDictMap = localDict
    }
    localDictMap[type] = list

    setdLocalDict(localDictMap)
  }

  const getBySysCode = (syscode: string) => {
    return newDict[syscode] ? newDict[syscode] : {}
  }

  return { dict: newDict, loadDict, setLocal, getBySysCode }
}
