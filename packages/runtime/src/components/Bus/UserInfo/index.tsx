import React,{useLayoutEffect} from "react";
import { Input } from "antd";
import { getUser } from "../../Auth";
import {
  FormComponentProps,
  FormComponent,
} from "@scboson/sc-element/es/c-form";
import { useSetState, useUpdateEffect } from "ahooks";

export interface UserDeptProp extends FormComponentProps {
  init?: boolean;
  onChange?:any;
}


const UserInfo: FormComponent<UserDeptProp> = (props) => {
  const {
    readonly,
    name,
    form,
    onChange,
    fieldProps,
    init = true,
    ...restProps
  } = props;

  const user: any = getUser() || {};
  const { userName } = user;
  useLayoutEffect(() => {
    const user = getUser()

    if (user) {
      const {
      realName
      } = user
      onChange&&onChange(realName)
    }
  }, [])
  if (readonly) {
    return <div>{userName}</div>;
  } else {
    return <Input value={userName} {  ...restProps}></Input>;
  }
};
UserInfo.customView = true;

export default UserInfo;
