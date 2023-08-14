import { useEffect, useState } from "react";
import { Form, Input, Button, Tabs, Modal, Spin } from "antd";
import { urlSafeBase64Decode, urlSateBase64Encode } from "../../utils/common";
import SMSCode from "../SMSCode";
import { uesRequest } from "../../utils/api";
import { setUser, clearUser } from "../Auth";
//@ts-ignore
import { history } from "@@/core/history";
import { useLocation } from "@umijs/renderer-react";
import queryString from "query-string";

import styles from "./index.less";


import logo from "../../assets/login/logo.png";
import phonepng from "../../assets/login/u650.png";
import wxpng from "../../assets/login/u651.png";
import { useMount, useExternal, useUpdateEffect } from "ahooks";
import createWxLoginQr from "../../wxConfig";

const { TabPane } = Tabs;
const { parse } = queryString;
const Encrypt = require("../../../publish/jsencrypt.min.js");
console.log(Encrypt)
const Login: React.FC<any> = (props: any) => {
  const [activeKey, setActiveKey] = useState("wx");
  const [state, setState] = useState(1);

  const location = useLocation();
  const { loading, run } = uesRequest("user", "loginByPhone");
  const wechatCodeLogin = uesRequest("user", "wechatCodeLogin");
  const getPublicKey = uesRequest("user", "getPublicKey");

  const pageParams = parse(location.search) || {};;

  const [status] = useExternal(
    "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js",
    {
      js: {
        async: true,
      },
    }
  );

  const loginCallBack = (data: any) => {
    const { currentDept } = data;
    setUser(data);
    if (data.needModifyPwd) {
      history.push("/system/current/initpassword");
      return;
    }
    if (currentDept != null) {
      const menus = currentDept.menus;
      if (Array.isArray(menus) && menus.length > 0) {
        history.push(`/${menus[0].pageUrl}`);
      } else {
        history.push(`/`);
      }
    } else {
      history.push("/selectDept");
      return;
    }
  };

  useUpdateEffect(() => {
    if (status === "ready") {
      createWxLoginQr("wx_login_container", "/login");
    }
  }, [status]);

  useEffect(() => {
    if (pageParams.code !== undefined && pageParams.code !== null) {
      wechatCodeLogin
        .run(pageParams)
        .then((data: any) => {
          loginCallBack(data);
        })
        .catch((error) => {
          if (error && error.data.errorCode === "A100115") {
            Modal.warning({
              title: "提示",
              content:
                "当前微信暂未绑定长嘴猫账号，请使用账号密码登录后在【个人中心】进行绑定",
              onOk() {
                setActiveKey("custom");
              },
            });
          }
        });
    }
  }, [pageParams.code]);

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
      loginCallBack(data);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const tabRender = (type: "wx" | "custom") => {
    if (type === "wx") {
      return (
        <span>
          <img src={wxpng} className={styles["login-title-logo"]}></img>
          微信扫码登录
        </span>
      );
    } else {
      return (
        <span>
          <img src={phonepng} className={styles["login-title-logo"]}></img>
          账号密码登录
        </span>
      );
    }
  };

  useMount(() => {
    clearUser();
  });
  return (
    <Spin spinning={wechatCodeLogin.loading} tip="跳转登录中...">
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
            <div className={styles["login-title"]}>运营平台</div>
            <Tabs centered activeKey={activeKey} onChange={setActiveKey}>
              <TabPane tab={tabRender("wx")} key="wx">
                <div className={styles["wx-content"]}>
                  <div id="wx_login_container" style={{ width: "300px" }}></div>
                </div>
              </TabPane>
              <TabPane tab={tabRender("custom")} key="custom">
                <div className={styles["login-container-content"]}>
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
                          pattern: /^1[2|3|4|5|6|7|8|9][0-9]{9}$/,
                          message: "请输入正确的手机号",
                        },
                      ]}
                    >
                      <Input
                        placeholder="请输入手机号"
                        size="large"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    {state === 1 ? (
                      <Form.Item
                        name="pwd"
                        rules={[{ required: true, message: "请输入密码" }]}
                      >
                        <Input.Password
                          placeholder="请输入登录密码"
                          size="large"
                        />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        name="code"
                        rules={[
                          { required: true, message: "短信验证码是 6 位数字" },
                        ]}
                      >
                        <Input
                          placeholder="输入短信验证码"
                          suffix={<SMSCode></SMSCode>}
                        />
                      </Form.Item>
                    )}
                    <div className={styles["login-container-btn"]}>
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

                      <div>
                        <div
                          className={styles["login-container-links-actions"]}
                        >
                          <a
                            onClick={() => {
                              history.push("/retrievepassword");
                            }}
                          >
                            忘记密码
                          </a>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Login;
