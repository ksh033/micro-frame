
/* eslint-disable import/no-duplicates */
/// <reference path="../../../typings.d.ts" />
import React from 'react';
import type { GlobalHeaderRightProps } from './AvatarDropdown'

import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';


const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = props => {
  const { theme, layout, currentUser, menu } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>


      <Avatar currentUser={currentUser} menu={menu}/>

    </div>
  );
};

export default GlobalHeaderRight
