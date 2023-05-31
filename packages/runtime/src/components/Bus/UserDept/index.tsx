import React, { useLayoutEffect, useRef } from "react";
import { ScSelect } from "@scboson/sc-element";
import { getUser } from "../../Auth";
import { ScSelectProps } from "@scboson/sc-element/es/sc-select/index";
import {
  FormComponentProps,
  FormComponent,
} from "@scboson/sc-element/es/c-form";
import { useSetState, useUpdateEffect } from "ahooks";
import { getServiceApi } from "../../../utils/api";

export interface UserDeptProp extends ScSelectProps, FormComponentProps {
  init?: boolean;
  needCompany?: boolean;
  companyNeedInit?: boolean;
  companyTypes?: (
    | "CHAIN_MANAGE_COMPANY"
    | "SUPPLY_CHAIN_COMPANY"
    | "SUPPLY_SUBCOMPANY"
    | "SHOP"
    | "WAREHOUSE"
  )[]; // 集团底下要查询哪个组织机构
}

interface UserDeptPropState {
  disabled: boolean;
  data: any[];
}
const queryAll = getServiceApi("system", "company");
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
    companyTypes = ["CHAIN_MANAGE_COMPANY"],
    ...restProps
  } = props;
  const deptList = useRef<any[]>([]);
  const [state, setState] = useSetState<UserDeptPropState>({
    disabled: false,
    data: [],
  });

  const initValue = (currentDeptMsg: any) => {
    const { bizDeptName, bizDeptId, bizDeptType, companyId, companyName } =
      currentDeptMsg;

    if (init && props.value == null) {
      if (
        bizDeptType === "CHAIN_MANAGE_COMPANY" ||
        bizDeptType === "SUPPLY_CHAIN_COMPANY" ||
        bizDeptType === "SUPPLY_SUBCOMPANY" ||
        bizDeptType === "WAREHOUSE"
      ) {
        onChange?.(
          labelInValue
            ? { value: bizDeptId || "", text: bizDeptName }
            : bizDeptId,
          {
            value: bizDeptId || "",
            text: bizDeptName,
            ...currentDeptMsg,
          }
        );
      } else {
        onChange?.(
          labelInValue
            ? { value: companyId || "", text: companyName }
            : companyId,
          {
            value: companyId || "",
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
      if (
        currentDept.bizDeptType !== "COMPANY" &&
        currentDept.bizDeptType !== "SHOP"
      ) {
        initValue(currentDept);
      } else {
        if (companyNeedInit && state.data.length > 0 && props.value == null) {
          const itemFirst = state.data[0];
          onChange?.(
            labelInValue
              ? {
                  value: itemFirst.companyId || "",
                  text: itemFirst.companyName,
                }
              : itemFirst.companyId,
            {
              value: itemFirst.companyId || "",
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
        if (bizDeptType === "COMPANY" || bizDeptType === "SHOP") {
          queryAll({
            companyTypes: companyTypes,
          }).then((_data: any[]) => {
            if (_data) {
              if (needCompany && bizDeptType !== "SHOP") {
                _data.unshift({
                  companyId: currentDept.bizDeptId,
                  companyName: currentDept.bizDeptName,
                });
              }
              deptList.current = _data;
              setState({
                disabled: false,
                data: _data,
              });
            }
          });
        } else if (
          bizDeptType === "CHAIN_MANAGE_COMPANY" ||
          bizDeptType === "SUPPLY_CHAIN_COMPANY" ||
          bizDeptType === "SUPPLY_SUBCOMPANY" ||
          bizDeptType === "WAREHOUSE"
        ) {
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
          disabled: bizDeptType !== "COMPANY",
          data: deptList.current,
        });
      }
    }
  }, []);

  const handleChange = (value: any, option: any) => {
    const deptId = typeof value === "object" ? value.value : value;
    const index = state.data.findIndex((item) => {
      return item.companyId === deptId;
    });
    onChange &&
      onChange(value, {
        ...option,
        ...state.data[index],
      });
  };

  const formatName = (_value: any, list: any[]) => {
    let res = "";
    if (_value !== undefined && _value !== null && Array.isArray(list)) {
      const index = list.findIndex((item) => {
        return item.companyId === _value;
      });

      if (index > -1) {
        res = list[index] ? list[index].companyName : "";
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
UserDept.customView = true;

export default UserDept;
