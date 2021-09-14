/* eslint-disable global-require */
import React from 'react'

import { PageContainer } from '@micro-frame/sc-runtime'

import Password from './password'

import sytles from './baseStyles.less';


const Page: FC<any> = (props) => {
  

  return (
    <PageContainer title={'修改密码'} subTitle={"首次登入需要修改初始化密码"}>
        <div className={sytles.initpwd}>
        <Password></Password>

        </div>
  
    </PageContainer>
  )
}

export default Page
