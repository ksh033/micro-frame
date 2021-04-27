/* eslint-disable global-require */
import React, { useLayoutEffect, FC } from "react";
import { CForm } from "@scboson/sc-element";
import { EditPage, useEditPageContext } from "@scboson/sc-schema";
import { ModalPageContainer } from "@micro-frame/sc-runtime";
import { getService, uesRequest } from "@/utils/api";
import { Auth } from "@micro-frame/sc-runtime";

import formData from "./components/form";

const services = getService(
  "deptUser",
  "formSubmit",
  "detail",
  "formSubmit",
  "querySysList",
  "queryDeptList"
);

const roleServices = getService("role", "listDeptRole");

const pagaConfig = {
  service: { ...services, ...roleServices },
  pageType: "modalpage",
  ...formData,
};
interface UserEditState {
  systemCode: string;

  bizDeptId: string;
}

const Page: FC<any> = (props) => {
  const scope = useEditPageContext<UserEditState>();
  const action = scope.getAction();

  const pageLoad = async () => {
    const systemCode = Auth.getUser()?.userAppInfo.currentSystem.systemCode;

    const bizDeptId = Auth.getUser()?.userAppInfo.currentDept.bizDeptId;

    const record = {
      systemCode,
      bizDeptId,
    };
    scope.setData({ systemCode: systemCode, bizDeptId: bizDeptId });
    scope.toInitialValues({ defaultValues: record });
  };

  const formConfig = scope
    .getFormInfo()
    .changeFormItem("systemCode", {})
    .changeFormItem("bizDeptId", {
      props: { params: { sysCode: scope.data.systemCode } },
    })
    .changeFormItem("sysRoleList", {
      props: {
        params: {
          sysCode: scope.data.systemCode,
          bizDeptId: scope.data.bizDeptId,
        },
        
      },
    })
    .toConfig();
  const modalButtons = scope.getModalBtns(action, true);
  const title = scope.getTitle(action);

  useLayoutEffect(() => {
    pageLoad();
  }, []);

  return (
    <ModalPageContainer title={title} toolbar={modalButtons}>
      <CForm {...formConfig} layout="vertical" action={action} anchor={false} />
    </ModalPageContainer>
  );
};

export default EditPage(Page, pagaConfig);
