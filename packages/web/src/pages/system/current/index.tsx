/* eslint-disable global-require */
import React, { FC } from 'react'
import { PageContainer } from '@micro-frame/sc-runtime'
import { useSetState } from 'ahooks'
import BaseView from './base'
import Password from './password'
import styles from './style.less'
import { Menu } from 'antd'

type SettingsStateKeys = 'base' | 'password'
interface SettingsState {
  mode: 'inline' | 'horizontal'
  menuMap: {
    [key: string]: React.ReactNode
  }
  selectKey: SettingsStateKeys
}

const Page: FC<any> = (props) => {
  const menuMap = {
    base: '基础信息',
    password: '修改密码',
  }

  const [state, setState] = useSetState<SettingsState>({
    mode: 'inline',
    menuMap: menuMap,
    selectKey: 'base',
  })

  const selectKey = (key: SettingsStateKeys) => {
    setState({
      selectKey: key,
    })
  }

  const getRightTitle = () => {
    const { selectKey, menuMap } = state
    return menuMap[selectKey]
  }

  const renderChildren = () => {
    const { selectKey } = state
    switch (selectKey) {
      case 'base':
        return <BaseView />
      case 'password':
        return <Password />
      default:
        break
    }

    return null
  }

  return (
    <PageContainer title={'个人设置'}>
      <div className={styles.main}>
        <div className={styles.leftMenu}>
          <Menu
            mode={'inline'}
            selectedKeys={[state.selectKey]}
            onClick={({ key }) => selectKey(key as SettingsStateKeys)}
          >
            <Menu.Item key="base">基础信息</Menu.Item>
            <Menu.Item key="password">修改密码</Menu.Item>
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{getRightTitle()}</div>
          {renderChildren()}
        </div>
      </div>
    </PageContainer>
  )
}

export default Page
