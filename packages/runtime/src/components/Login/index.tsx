import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { urlSafeBase64Decode, urlSateBase64Encode } from "../../utils/common";
import SMSCode from "../SMSCode";
import { uesRequest } from "../../utils/api";
import { setUser, getUser, checkUserDept,clearUser } from "../Auth";
//@ts-ignore
import { history } from "umi";
import styles from "./index.less";
import logo from "../../assets/login/logo.png";
import {useMount} from 'ahooks'
const Encrypt = require("../../assets/jsencrypt.min");

const Login: React.FC<any> = () => {
  const [state, setstate] = useState(1);
  //  const { signin } = useModel('useAuthModel');
  const { loading, run } = uesRequest("user", "loginByPhone");
  const getPublicKey = uesRequest("user", "getPublicKey");
  const onFinish = async (values: any) => {

   
    const publicKey = await getPublicKey.run();
    if (publicKey) {
      let encryptor = new Encrypt.JSEncrypt();
      encryptor.setPublicKey(urlSafeBase64Decode(publicKey)); // 设置公钥
      const cipherStr = encryptor.encrypt(JSON.stringify(values)); // 对需要加密的数据进行加密

      //接口参数
      const params = {
        cipherStr: urlSateBase64Encode(cipherStr),
      };
      const data = await run(params);
      const { chooseSysVO, ...userInfo } = data;
      userInfo.userAppInfo = chooseSysVO;
      setUser(userInfo);
      if (userInfo.needModifyPwd) {
        history.push("/system/current/initpassword");
        return;
      }
      if (!checkUserDept(window.location.pathname)) {
        history.push("/selectDept");
        return;
      } else {
        const { systemCode } = userInfo?.userAppInfo.currentSystem || {};
        //@ts-ignore
        // if (window.__POWERED_BY_QIANKUN__){
        history.push(`/${systemCode}`);
        return;
        //}else{
        // history.push(`/`);
        // }
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useMount(()=>{
    clearUser();
  })
  return (
    <div className={styles["login-account"]}>
      <div className={styles["login-account-left"]}></div>
      <div className={styles["login-account-right"]}></div>
      <div className={styles["login-container"]}>
        <div className={styles["login-container-left"]}>
          <div className={styles["logo"]}>
            <img src={logo} alt="lgog"></img>
          </div>
        </div>
        <div className={styles["login-container-right"]}>
          {/* <div className={styles['login-title']}>运营平台</div> */}
          <div className={styles["login-container-content"]}>
            <div className={styles["login-container-header"]}>
              <span
                className={state === 1 ? styles["bold"] : ""}
                onClick={() => {
                  setstate(1);
                }}
              >
                密码登录
              </span>
              <span
                className={state === 2 ? styles["bold"] : ""}
                onClick={() => {
                  setstate(2);
                }}
              >
                验证码登录
              </span>
            </div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className={styles["base-line-form"]}
            >
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "请输入手机号" },
                  {
                    pattern: /^1[3|4|5|6|7|8][0-9]{9}$/,
                    message: "请输入正确的手机号",
                  },
                ]}
              >
                <Input placeholder="请输入手机号" size="large" />
              </Form.Item>
              {state === 1 ? (
                <Form.Item
                  name="pwd"
                  rules={[{ required: true, message: "请输入密码" }]}
                >
                  <Input.Password placeholder="请输入登录密码" size="large" />
                </Form.Item>
              ) : (
                <Form.Item
                  name="code"
                  rules={[{ required: true, message: "短信验证码是 6 位数字" }]}
                >
                  <Input
                    placeholder="输入短信验证码"
                    suffix={<SMSCode></SMSCode>}
                  />
                </Form.Item>
              )}
              <div className={styles["login-container-btn"]}>
                <Checkbox>3天内自动登录</Checkbox>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className={styles["base-btn"]}
                  block
                >
                  登&nbsp;&nbsp;录
                </Button>

                {/* <div>
                  <div className={styles['login-container-links-actions']}>
                    <a href="#">忘记密码</a>
                    <Divider type="vertical" />
                    <a href="#">免费注册</a>
                  </div>
                </div> */}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
