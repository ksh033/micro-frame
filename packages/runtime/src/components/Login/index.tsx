import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
// import { useModel, history } from 'umi';

 import SMSCode from '../SMSCode';
 import { uesRequest } from '../../utils/api';
import { setUser, getUser } from '../Auth'

//@ts-ignore
import { history } from 'umi'

import styles from './index.less';

import logo from '../../assets/login/logo.png';

const Login: React.FC<any> = () => {
  const [state, setstate] = useState(1);
 //  const { signin } = useModel('useAuthModel');
  const { loading, run } = uesRequest('user', 'loginByPhone');
  const onFinish = async (values: any) => {
    const data = await run(values);
    const { chooseSysVO, ...userInfo } = data
    userInfo.userAppInfo = chooseSysVO
     setUser(userInfo);
    const user = getUser()
    // const { systemCode } = user?.userAppInfo.currentSystem || {};
     history.push(`/`);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className={styles['login-account']}>
      <div className={styles['login-container']}>
        <div className={styles['login-container-left']}>
          <div className={styles['logo']}>
            <img src={logo} alt="lgog"></img>
          </div>
        </div>
        <div className={styles['login-container-right']}>
          <div className={styles['login-title']}>运营平台</div>
          <div className={styles['login-container-content']}>
            <div className={styles['login-container-header']}>
              <span
                className={state === 1 ? styles['bold'] : ''}
                onClick={() => {
                  setstate(1);
                }}
              >
                密码登录
              </span>
              <span
                className={state === 2 ? styles['bold'] : ''}
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
              className="base-line-form"
            >
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3|4|5|6|7|8][0-9]{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
              {state === 1 ? (
                <Form.Item name="pwd" rules={[{ required: true, message: '请输入密码' }]}>
                  <Input.Password placeholder="请输入登录密码" />
                </Form.Item>
              ) : (
                <Form.Item
                  name="code"
                  rules={[{ required: true, message: '短信验证码是 6 位数字' }]}
                >
                  <Input placeholder="输入短信验证码" suffix={<SMSCode></SMSCode>} />
                </Form.Item>
              )}
              <div className={styles['login-container-btn']}>
                <Checkbox>3天内自动登录</Checkbox>
                <Button type="primary" htmlType="submit" loading={loading} className={styles['base-btn']}>
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
