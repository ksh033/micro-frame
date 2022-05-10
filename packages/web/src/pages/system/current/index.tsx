/* eslint-disable global-require */
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useSetState } from 'ahooks';
import BaseView from './base';
import Password from './password';
import styles from './style.less';
import { Menu, Modal, Spin } from 'antd';
import BindingView from './components/binding';
import {
  useServiceRequest,
  Auth,
  PageContainer,
} from '@micro-frame/sc-runtime';
import type { User } from '@micro-frame/sc-runtime/es/components/Auth';
import { setUser } from '@micro-frame/sc-runtime/es/components/Auth';
import { CModal } from '@scboson/sc-element';
import { openBindWx } from './components/BindWx';
import { history } from 'umi';

type SettingsStateKeys = 'base' | 'password' | 'binding';
interface SettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: Record<string, React.ReactNode>;
  selectKey: SettingsStateKeys;
  user?: User | null;
}

const Page: FC<any> = (props) => {
  const { location } = props;

  const pageParams = location.query;
  const defaultKey = pageParams.currentKey || 'base';

  const bindwx = useServiceRequest('user', 'bindwx');
  const user = Auth.getUser();

  const menuMap = {
    base: '基础信息',
    password: '修改密码',
    binding: '绑定微信',
  };

  const [state, setState] = useSetState<SettingsState>({
    mode: 'inline',
    menuMap: menuMap,
    selectKey: defaultKey,
    user: user,
  });
  const setCurrentUser = (newUser: User) => {
    setState({
      user: newUser,
    });
    setUser(newUser);
  };

  // 绑定微信
  useEffect(() => {
    if (pageParams.code !== undefined && pageParams.code !== null) {
      Modal.destroyAll();
      bindwx
        .run(pageParams)
        .then((res: any) => {
          if (user !== null && user !== undefined) {
            const newUser = {
              ...user,
              wechatAvatarUrl: res.wechatAvatarUrl,
              wechatNickname: res.wechatNickname,
              wechatUnionId: res.wechatUnionId,
            };
            setCurrentUser(newUser);
            history.push({
              pathname: '/system/current',
              query: {
                currentKey: 'binding',
              },
            });
          }
        })
        .catch((error: any) => {
          console.log(error);
          if (error && error.data.errorCode === 'A100116') {
            CModal.confirm({
              title: error.data.errorShowTip,
              okText: '绑定其他微信',
              cancelText: '放弃绑定',
              onOk: () => {
                Modal.destroyAll();
                openBindWx({});
              },
              onCancel() {
                history.push({
                  pathname: '/system/current',
                  query: {
                    currentKey: 'binding',
                  },
                });
              },
            });
          } else {
            history.push({
              pathname: '/system/current',
              query: {
                currentKey: 'binding',
              },
            });
          }
        });
    }
  }, [pageParams.code]);

  const selectKey = (key: SettingsStateKeys) => {
    setState({
      selectKey: key,
    });
  };

  const getRightTitle = () => {
    return state.menuMap[state.selectKey];
  };

  const renderChildren = () => {
    switch (state.selectKey) {
      case 'base':
        return <BaseView />;
      case 'password':
        return <Password />;
      case 'binding':
        return (
          <BindingView
            user={state.user}
            setUser={setCurrentUser}
            autoOpenWxCode={Boolean(pageParams.autoOpen)}
          />
        );
      default:
        break;
    }

    return null;
  };

  return (
    <PageContainer
      title={'个人设置'}
      header={{
        onBack: () => history.goBack(),
      }}
    >
      <Spin spinning={bindwx.loading} tip="绑定中...">
        <div className={styles.main}>
          <div className={styles.leftMenu}>
            <Menu
              mode={'inline'}
              selectedKeys={[state.selectKey]}
              onClick={({ key }) => selectKey(key as SettingsStateKeys)}
            >
              <Menu.Item key="base">基础信息</Menu.Item>
              <Menu.Item key="password">修改密码</Menu.Item>
              <Menu.Item key="binding">绑定微信</Menu.Item>
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{getRightTitle()}</div>
            {renderChildren()}
          </div>
        </div>
      </Spin>
    </PageContainer>
  );
};

export default Page;
