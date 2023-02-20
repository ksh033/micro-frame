import React, { useLayoutEffect, useRef } from 'react';
import { ScSelect } from '@scboson/sc-element';
import { getUser } from '../../Auth';
import { ScSelectProps } from '@scboson/sc-element/es/sc-select/index';
import {
  FormComponentProps,
  FormComponent,
} from '@scboson/sc-element/es/c-form';
import { useSetState, useUpdateEffect } from 'ahooks';
import { getServiceApi } from '../../../utils/api';

export interface ChainManageComPanySelectProp
  extends ScSelectProps,
  FormComponentProps {
  init?: boolean;
  companyNeedInit?: boolean;
}

interface ChainManageComPanySelectPropState {
  disabled: boolean;
  data: any[];
}
const queryAll = getServiceApi('system', 'company');
const ChainManageComPanySelect: FormComponent<ChainManageComPanySelectProp> = (
  props
) => {
  const {
    readonly,
    name,
    form,
    onChange,
    fieldProps,
    labelInValue = false,
    init = true,
    companyNeedInit = false,
    ...restProps
  } = props;
  const deptList = useRef<any[]>([]);
  const [state, setState] = useSetState<ChainManageComPanySelectPropState>({
    disabled: false,
    data: [],
  });

  const isNeddInitDeptType = (bizDeptType: string) => {
    return (
      bizDeptType !== 'COMPANY' &&
      bizDeptType !== 'SUPPLY_SUBCOMPANY' &&
      bizDeptType !== 'SUPPLY_CHAIN_COMPANY'
    );
  };

  const initValue = (currentDeptMsg: any) => {
    const { bizDeptName, bizDeptId, bizDeptType, companyId, companyName } =
      currentDeptMsg;

    if (init && props.value == null) {
      if (bizDeptType === 'CHAIN_MANAGE_COMPANY') {
        onChange?.(
          labelInValue
            ? { value: bizDeptId || '', text: bizDeptName }
            : bizDeptId,
          {
            value: bizDeptId || '',
            text: bizDeptName,
            ...currentDeptMsg,
          }
        );
      } else {
        onChange?.(
          labelInValue
            ? { value: companyId || '', text: companyName }
            : companyId,
          {
            value: companyId || '',
            text: companyName,
            ...currentDeptMsg,
          }
        );
      }
    }
  };
  useUpdateEffect(() => {
    const user = getUser();
    if (user) {
      const {
        userAppInfo: { currentDept },
      } = user;
      if (isNeddInitDeptType(currentDept.bizDeptType)) {
        initValue(currentDept);
      } else {
        if (companyNeedInit && state.data.length > 0 && props.value == null) {
          const itemFirst = state.data[0];
          onChange?.(
            labelInValue
              ? {
                value: itemFirst.companyId || '',
                text: itemFirst.companyName,
              }
              : itemFirst.companyId,
            {
              value: itemFirst.companyId || '',
              text: itemFirst.companyName,
              ...itemFirst,
            }
          );
        }
      }
    }
  }, [state.data]);

  useLayoutEffect(() => {
    const user = getUser();

    if (user) {
      const {
        userAppInfo: { currentDept },
      } = user;
      const { bizDeptType } = currentDept;
      if (deptList.current.length === 0) {
        if (
          bizDeptType === 'COMPANY' ||
          bizDeptType === 'SUPPLY_CHAIN_COMPANY'
        ) {
          queryAll({
            companyTypes: ['CHAIN_MANAGE_COMPANY'],
          }).then((_data: any[]) => {
            if (_data) {
              deptList.current = _data;
              setState({
                disabled: false,
                data: _data,
              });
            }
          });
        } else if (bizDeptType === 'CHAIN_MANAGE_COMPANY') {
          deptList.current = [
            {
              companyId: currentDept.bizDeptId,
              companyName: currentDept.bizDeptName,
            },
          ];
          setState({
            disabled: true,
            data: deptList.current,
          });
        } else {
          deptList.current = [
            {
              companyId: currentDept.companyId,
              companyName: currentDept.companyName,
            },
          ];
          setState({
            disabled: true,
            data: deptList.current,
          });
        }
      } else {
        setState({
          disabled: bizDeptType !== 'COMPANY',
          data: deptList.current,
        });
      }
    }
  }, []);

  const handleChange = (value: any, option: any) => {
    const deptId = typeof value === 'object' ? value.value : value;
    const index = state.data.findIndex((item) => {
      return item.deptId === deptId;
    });
    onChange &&
      onChange(value, {
        ...option,
        ...state.data[index],
      });
  };

  const formatName = (_value: any, list: any[]) => {
    let res = '';
    if (_value !== undefined && _value !== null && Array.isArray(list)) {
      const index = list.findIndex((item) => {
        return item.deptId === _value;
      });

      if (index > -1) {
        res = list[index] ? list[index].deptName : '';
      }
    }
    return <div>{res}</div>;
  };

  if (readonly) {
    return formatName(restProps.value, state.data);
  } else {
    return (
      <ScSelect
        data={state.data}
        valueField="companyId"
        textField="companyName"
        disabled={state.disabled}
        onChange={handleChange}
        labelInValue={labelInValue}
        allowClear
        {...restProps}
      ></ScSelect>
    );
  }
};

export default ChainManageComPanySelect;
