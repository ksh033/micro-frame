import _ from 'lodash'
import { VdProFormColumnsType } from '@scvisual/element'
import { Rules } from 'async-validator/dist-types/interface'
import { ProFormColumnsType } from '@ant-design/pro-form'
import { valueTypelist } from '../index'

export function genNonDuplicateId(randomLength: number | undefined = 10) {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3, randomLength)
  return idStr
}

const isNoStyle = (valueType) => {
  return valueTypelist.indexOf(valueType) > -1
}

const converFormItem = (
  list: VdProFormColumnsType[],
  columnList: ProFormColumnsType[]
) => {
  if (Array.isArray(list)) {
    list.forEach((it: VdProFormColumnsType) => {
      const { columns, ...restIt } = it
      let newItem: ProFormColumnsType<any, any> = restIt
      let newColumns: ProFormColumnsType[] = []
      if (Array.isArray(columns) && columns.length > 0) {
        converFormItem(columns, newColumns)
        newItem.columns = newColumns
      }
      if (_.isNil(newItem.formItemProps)) {
        newItem.formItemProps = {}
      }
      if (isNoStyle(it.valueType)) {
        newItem.formItemProps = {
          ...newItem.formItemProps,
          noStyle: true,
        }
        newItem.fieldProps = {
          ...(newItem.fieldProps || {}),
          formItemTitle: it.title,
        }
      }
      columnList.push(newItem)
    })
  }
}

export const filterPageConfig = (
  propsConfig: VdProFormColumnsType<any>[]
): ProFormColumnsType[] => {
  let itemInfos: VdProFormColumnsType<any>[] = _.cloneDeep(propsConfig)
  const newColumn: ProFormColumnsType[] = []
  converFormItem(itemInfos, newColumn)
  return newColumn
}

export function getType(obj: any) {
  // @ts-ignore
  var type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase()

  if (obj === null) return 'null' // PhantomJS has type "DOMWindow" for null

  if (obj === undefined) return 'undefined' // PhantomJS has type "DOMWindow" for undefined

  return type
}

export const ObjToMap = (value: any) => {
  if (getType(value) === 'map') {
    return value
  }

  return new Map(Object.entries(value || {}))
}

export function proFieldParsingValueEnumToArray(valueEnumParams: any) {
  var enumArray: any[] = []
  var valueEnum = ObjToMap(valueEnumParams)
  valueEnum.forEach(function (_: any, key: string) {
    var value = valueEnum.get(key) || valueEnum.get(''.concat(key))

    if (!value) {
      return
    }

    if (
      getType(value) === 'object' &&
      (value === null || value === void 0 ? void 0 : value.text)
    ) {
      enumArray.push({
        text: value === null || value === void 0 ? void 0 : value.text,
        value: key,
        label: value === null || value === void 0 ? void 0 : value.text,
        disabled: value.disabled,
        icon: value.icon,
      })
      return
    }

    enumArray.push({
      text: value,
      value: key,
    })
  })
  return enumArray
}

export function getRequiresNameList(rules: Rules): string[] {
  const list: string[] = []
  Object.keys(rules).forEach((key) => {
    const it = rules[key]
    if (Array.isArray(it)) {
      const index = it.findIndex((item) => item.required)
      if (index > -1) {
        list.push(key)
      }
    } else {
      if (it.required) {
        list.push(key)
      }
    }
  })
  return list
}
