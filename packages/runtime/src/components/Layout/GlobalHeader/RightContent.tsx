/* eslint-disable import/no-duplicates */
/// <reference path="../../../typings.d.ts" />
import React from 'react'
import type { GlobalHeaderRightProps } from './AvatarDropdown'
import { uesRequest } from '../../../utils/api'
import { clearUser } from '../../Auth'
import Avatar from './AvatarDropdown'
import styles from './index.less'
// @ts-ignore
import { history } from 'umi'
import { Button } from 'antd'

export type SiderTheme = 'light' | 'dark'

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout, currentUser, menu } = props
  const { run } = uesRequest('user', 'logout')
  let className = styles.right

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`
  }
  const layoutFn = () => {
    run().then(() => {
      clearUser()
      history.push('/login')
    })
  }

  return (
    <div className={className}>
      <div>
        <a href="./长嘴猫客户端-v1.7.1.2.exe">下载打印插件</a>
      </div>
      <Avatar currentUser={currentUser} menu={menu} layoutFn={layoutFn} />
    </div>
  )
}

export default GlobalHeaderRight
