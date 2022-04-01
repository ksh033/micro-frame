import React, { useLayoutEffect, useRef } from 'react'
import { ScSelect } from '@scboson/sc-element'
import { getUser } from '../../Auth'
import { ScSelectProps } from '@scboson/sc-element/es/sc-select/index'
import {
  FormComponentProps,
  FormComponent,
} from '@scboson/sc-element/es/c-form'
import { useSetState, useUpdateEffect } from 'ahooks'
import { getServiceApi } from '../../../utils/api'

export interface UserDeptProp extends ScSelectProps, FormComponentProps {
  init?: boolean
  needCompany?: boolean
  companyNeedInit?: boolean
}

interface UserDeptPropState {
  disabled: boolean
  data: any[]
}
const queryAll = getServiceApi('system', 'subcompany')
const UserDept: FormComponent<UserDeptProp> = (props) => {
  const {
    readonly,
    name,
    form,
    onChange,
    fieldProps,
    labelInValue = false,
    init = true,
    needCompany = true,
    companyNeedInit = false,
    ...restProps
  } = props
  const deptList = useRef<any[]>([])
  const [state, setState] = useSetState<UserDeptPropState>({
    disabled: false,
    data: [],
  })

  const initValue = (currentDeptMsg: any) => {
    const {
      bizDeptName,
      bizDeptId,
      bizDeptType,
      subcompanyId,
      subcompanyName,
    } = currentDeptMsg

    if (init) {
      if (bizDeptType === 'SUBCOMPANY') {
        onChange?.(
          labelInValue
            ? { value: bizDeptId || '', text: bizDeptName }
            : bizDeptId,
          {
            value: bizDeptId || '',
            text: bizDeptName,
            ...currentDeptMsg,
          }
        )
      } else {
        onChange?.(
          labelInValue
            ? { value: subcompanyId || '', text: subcompanyName }
            : subcompanyId,
          {
            value: subcompanyId || '',
            text: subcompanyName,
            ...currentDeptMsg,
          }
        )
      }
    }
  }
  useUpdateEffect(() => {
    const user = getUser()
    if (user) {
      const {
        userAppInfo: { currentDept },
      } = user
      if (currentDept.bizDeptType !== 'COMPANY') {
        initValue(currentDept)
      } else {
        if (companyNeedInit && state.data.length > 0) {
          const itemFirst = state.data[0]
          onChange?.(
            labelInValue
              ? {
                  value: itemFirst.subcompanyId || '',
                  text: itemFirst.subcompanyName,
                }
              : itemFirst.subcompanyId,
            {
              value: itemFirst.subcompanyId || '',
              text: itemFirst.subcompanyName,
              ...itemFirst,
            }
          )
        }
      }
    }
  }, [state.data])

  useLayoutEffect(() => {
    const user = getUser()

    if (user) {
      const {
        userAppInfo: { currentDept },
      } = user
      const { bizDeptType } = currentDept
      if (deptList.current.length === 0) {
        if (bizDeptType === 'COMPANY') {
          queryAll().then((_data: any[]) => {
            if (_data) {
              if (needCompany) {
                _data.unshift({
                  subcompanyId: currentDept.bizDeptId,
                  subcompanyName: currentDept.bizDeptName,
                })
              }
              deptList.current = _data
              setState({
                disabled: false,
                data: _data,
              })
            }
          })
        } else if (bizDeptType === 'SUBCOMPANY') {
          deptList.current = [
            {
              subcompanyId: currentDept.bizDeptId,
              subcompanyName: currentDept.bizDeptName,
            },
          ]
          setState({
            disabled: true,
            data: deptList.current,
          })
        } else {
          deptList.current = [
            {
              subcompanyId: currentDept.subcompanyId,
              subcompanyName: currentDept.subcompanyName,
            },
          ]
          setState({
            disabled: true,
            data: deptList.current,
          })
        }
      } else {
        setState({
          disabled: bizDeptType !== 'COMPANY',
          data: deptList.current,
        })
      }
    }
  }, [])

  const handleChange = (value: any, option: any) => {
    const deptId = typeof value === 'object' ? value.value : value
    const index = state.data.findIndex((item) => {
      return item.deptId === deptId
    })
    onChange &&
      onChange(value, {
        ...option,
        ...state.data[index],
      })
  }

  const formatName = (_value: any, list: any[]) => {
    let res = ''
    if (_value !== undefined && _value !== null && Array.isArray(list)) {
      const index = list.findIndex((item) => {
        return item.deptId === _value
      })

      if (index > -1) {
        res = list[index] ? list[index].deptName : ''
      }
    }
    return <div>{res}</div>
  }

  if (readonly) {
    return formatName(restProps.value, state.data)
  } else {
    return (
      <ScSelect
        data={state.data}
        valueField="subcompanyId"
        textField="subcompanyName"
        disabled={state.disabled}
        onChange={handleChange}
        labelInValue={labelInValue}
        allowClear
        {...restProps}
      ></ScSelect>
    )
  }
}

export default UserDept
