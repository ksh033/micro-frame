/* eslint-disable global-require */
import React, { FC } from "react";
import { history } from "umi";
import { CForm } from "@scboson/sc-element";
import { EditPage, useEditPageContext } from "@scboson/sc-schema";
import { useServiceRequest, Auth } from "@micro-frame/sc-runtime";
import formData from "./components/passwordForm";
import { Alert, Button, message } from "antd";
import { JSEncrypt } from "jsencrypt";
import PasswordStrength, {
  chenkPwdStrength,
} from "./components/PasswordStrength/index";
import {
  urlSafeBase64Decode,
  urlSateBase64Encode,
} from "../../../utils/common";
import styles from "./baseStyles.less";

const pagaConfig = {
  service: {},
  pageType: "modalpage",
  ...formData,
};
interface CurrentUserState {}

const Page: FC<any> = (props) => {
  const scope = useEditPageContext<CurrentUserState>();
  const { run } = useServiceRequest("user", "changePwd");
  const getPublicKey = useServiceRequest("system", "getPublicKey");
  const formConfig = scope
    .getFormInfo()
    .changeFormItem("newPwd", {
      component: PasswordStrength,
      fieldProps: {
        required: true,
        rules: [
          {
            required: true,
            message: "请输入新密码：",
          },
          ({ getFieldValue }: any) => ({
            validator(rule: any, value: any) {
              if (chenkPwdStrength(value) >= 60) {
                return Promise.resolve();
              }
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject("密码强度不足");
            },
          }),
        ],
      },
    })
    .changeFormItem("confirmPwd", {
      fieldProps: {
        required: true,
        rules: [
          {
            required: true,
            message: "请输入确认密码：",
          },
          ({ getFieldValue }: any) => ({
            validator(rule: any, value: any) {
              if (!value || getFieldValue("newPwd") === value) {
                return Promise.resolve();
              }
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject("两次密码不一致!");
            },
          }),
        ],
      },
    })
    .toConfig();

  const handleSave = () => {
    formConfig.form.current.validateFields().then(async (values: any) => {
      return getPublicKey.run().then((publicKey) => {
        const data = JSON.stringify({
          oldPwd: values.oldPwd,
          newPwd: values.newPwd,
        });
        const ec = new JSEncrypt();
        ec.setPublicKey(urlSafeBase64Decode(publicKey));
        return run({ cipherStr: urlSateBase64Encode(ec.encrypt(data)) }).then(
          (data) => {
            if (data) {
              formConfig.form.current.resetFields();

              const user = Auth.getUser();
              if (user?.needModifyPwd === true) {
                message.success("修改成功");
                user.needModifyPwd = false;
                Auth.setUser(user);
                const { userAppInfo } = user;
                if (userAppInfo) {
                  history.push(`/${userAppInfo.currentSystem.systemCode}`);
                } else {
                  history.push(`/`);
                }
                return;
              }
              message.success("修改成功");
            }
            return data;
          }
        );
      });
    });
  };

  return (
    <div className={styles["user-current-base"]}>
      <CForm {...formConfig} layout="vertical" action="edit" anchor={false} />
      <Alert
        message="密码长度不少于8位，且由数字、大写字母、小写字母和特殊字符中的三种或者三种以上组成"
        banner
      />
      <Button type="primary" onClick={handleSave} style={{ marginTop: "20px" }}>
        修改
      </Button>
    </div>
  );
};

export default EditPage(Page, pagaConfig);
