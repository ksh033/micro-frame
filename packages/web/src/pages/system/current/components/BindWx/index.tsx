import React, { useLayoutEffect } from 'react'
import { CModal } from '@scboson/sc-element'
import type { DialogOptions } from '@scboson/sc-schema/es/interface'
import { ModalPageContainer, createWxLoginQr } from '@micro-frame/sc-runtime'
import styles from './index.less'

type BindWxProps = {
  close: () => void
  pageProps: {}
}

const BindWx: React.FC<BindWxProps> = (props) => {
  useLayoutEffect(() => {
    createWxLoginQr('wx_login_container', '/system/current?currentKey=binding')
  }, [])

  return (
    <ModalPageContainer>
      <div className={styles['wx-content']}>
        <div id="wx_login_container" className={styles['wx-qr']}></div>
      </div>
    </ModalPageContainer>
  )
}

export function openBindWx(newOptions: DialogOptions) {
  CModal.show({
    title: '绑定微信',
    showFull: false,
    okCancel: false,
    footer: null,
    width: 600,
    ...newOptions,
    bodyStyle: {
      padding: 0,
    },
    content: BindWx,
  })
}

export default BindWx
