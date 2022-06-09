import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { urlSafeBase64Decode, urlSateBase64Encode } from '../../utils/common';
import SMSCode from '../SMSCode';
import { uesRequest } from '../../utils/api';
//@ts-ignore
import { history } from 'umi';
import styles from './index.less';
import logo from '../../assets/login/logo.png';
import { chenkPwdStrength } from './components/check';

const Encrypt = require('../../assets/jsencrypt.min');

const RetrievePassword: React.FC<any> = (props: any) => {
  const { location } = props;
  const smscode = uesRequest('forgetpwd', 'smscode');
  const checkcode = uesRequest('forgetpwd', 'checkcode');
  const modify = uesRequest('forgetpwd', 'modify');
  const getPublicKey = uesRequest('user', 'getPublicKey');

  const [phone, setPhone] = useState();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const code = await checkcode.run({
      authCode: values.authCode,
      phone: values.phone,
    });

    if (code) {
      const publicKey = await getPublicKey.run();
      if (publicKey) {
        let encryptor = new Encrypt.JSEncrypt();
        encryptor.setPublicKey(urlSafeBase64Decode(publicKey)); // 设置公钥
        const cipherStr = encryptor.encrypt(
          JSON.stringify({
            principal: code.principal,
            pwd: values.pwd,
          })
        ); // 对需要加密的数据进行加密

        //接口参数
        const params = {
          cipherStr: urlSateBase64Encode(cipherStr),
        };
        const data = await modify.run(params);
        if (data) {
          message.success('操作成功');
          setTimeout(() => {
            history.push('/login');
          }, 1500);
        }
      }
    }
  };

  const onValuesChange = (changeVals: any) => {
    if (
      changeVals.hasOwnProperty('phone') &&
      /^1[3|4|5|6|7|8][0-9]{9}$/.test(changeVals.phone)
    ) {
      setPhone(changeVals.phone);
    }
  };

  return (
    <div className={styles['login-account']}>
      <div className={styles['login-account-left']}></div>
      <div className={styles['login-account-right']}></div>
      <div className={styles['login-container']}>
        <div className={styles['login-container-left']}>
          <div className={styles['logo']}>
            <img src={logo} alt="lgog"></img>
          </div>
        </div>
        <div className={styles['login-container-right']}>
          <div className={styles['login-title']}>找回密码</div>
          <div className={styles['login-container-content']}>
            <Form
              name="basic"
              onFinish={onFinish}
              form={form}
              className={styles['retrieve-pass-form']}
              onValuesChange={onValuesChange}
            >
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  {
                    pattern: /^1[3|4|5|6|7|8][0-9]{9}$/,
                    message: '请输入正确的手机号',
                  },
                ]}
              >
                <Input
                  placeholder="请输入手机号"
                  size="large"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                name="authCode"
                rules={[
                  {
                    required: true,
                    message: '短信验证码是 6 位数字',
                    len: 6,
                  },
                ]}
              >
                <Input
                  placeholder="输入短信验证码"
                  suffix={
                    <SMSCode request={smscode.run} phone={phone}></SMSCode>
                  }
                />
              </Form.Item>
              {/* 添加隐藏输入框防止自动回填 */}
              <input
                className={styles['login-hidden-input']}
                name="authCode"
                type="text"
              ></input>
              <input
                className={styles['login-hidden-input']}
                name="pwd"
                type="password"
              ></input>
              <Form.Item
                name="pwd"
                rules={[
                  { required: true, message: '请输入密码', min: 8 },
                  ({}: any) => ({
                    validator(rule: any, value: any) {
                      if (chenkPwdStrength(value) >= 60) {
                        return Promise.resolve();
                      }
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.reject('密码强度不足');
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="设置密码（不少于8位，包含数字和字母）"
                  size="large"
                />
              </Form.Item>
              <div className={styles['login-container-btn']}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={checkcode.loading || modify.loading}
                  className={styles['base-btn']}
                  block
                >
                  确认修改
                </Button>

                <div>
                  <div className={styles['login-container-links-actions']}>
                    已有账号?{' '}
                    <a
                      onClick={() => {
                        history.push('/login');
                      }}
                    >
                      登录
                    </a>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetrievePassword;
