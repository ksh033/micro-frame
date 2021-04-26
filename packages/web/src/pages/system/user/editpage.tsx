/* eslint-disable global-require */
import React, { useLayoutEffect, FC } from "react";
import { CForm } from "@scboson/sc-element";
import { EditPage, useEditPageContext } from "@scboson/sc-schema";
import { ModalPageContainer } from "@micro-frame/sc-runtime";
import { getService, uesRequest } from "@/utils/api";
import { Auth } from "@micro-frame/sc-runtime";

import formData from "./components/form";

const services = getService("deptUser", "formSubmit", "detail", "formSubmit");

const pagaConfig = {
  service: services,
  pageType: "modalpage",
  ...formData,
};

const Page: FC<any> = (props) => {
  const scope = useEditPageContext();
  scope.setData({list:[]})
  const action = scope.getAction();
  // const pageParam = scope.getPageParam();
  const roleReq=uesRequest('role','listDeptRole');
  const formConfig = scope
    .getFormInfo()
    .changeFormItem("systemCode", {
      
      props: { data: Auth.getUser()?.systemList },
    }).changeFormItem("bizDeptId",{
      props: { data: Auth.getUser()?.userAppInfo.deptList,onSelect:async()=>{


      } },

    })
    .toConfig();
  const modalButtons = scope.getModalBtns(action, true);
  const title = scope.getTitle(action);

  useLayoutEffect(() => {
    const record = {
      systemCode: Auth.getUser()?.userAppInfo.currentSystem.systemCode,
      bizDeptId: Auth.getUser()?.userAppInfo.currentDept.bizDeptId,
    };
    scope.toInitialValues({ defaultValues: record });
  }, []);

  return (
    <ModalPageContainer title={title} toolbar={modalButtons}>
      <CForm {...formConfig} layout="vertical" action={action} anchor={false} />
    </ModalPageContainer>
  );
};
interface Person{
  list:any[]
}


export default EditPage(Page, pagaConfig);
