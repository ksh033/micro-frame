import { BsImg, useServiceRequest } from '@micro-frame/sc-runtime'
import { Button, List, message } from 'antd'
import React, { Fragment, useEffect } from 'react'
import { openBindWx } from './BindWx'
import wechat from '../../../../assets/wechat.png'

const BindingView: React.FC<any> = (props) => {
  const { user, setUser, autoOpenWxCode } = props

  const wechatUnionId = user?.wechatUnionId
  const unbindwx = useServiceRequest('user', 'unbindwx')

  const handleBindClick = () => {
    openBindWx({})
  }

  const handleUnboundClick = () => {
    unbindwx.run({}).then((res: any) => {
      if (res) {
        message.success('解绑成功')
        if (user !== undefined && user !== null) {
          setUser?.({
            ...user,
            wechatAvatarUrl: null,
            wechatNickname: null,
            wechatUnionId: null,
          })
        }
      }
    })
  }

  useEffect(() => {
    if (autoOpenWxCode) {
      handleBindClick()
    }
  }, [autoOpenWxCode])

  const getData = () => [
    wechatUnionId === null
      ? {
          title: '绑定微信',
          description: '您当前暂未绑定微信账号',
          actions: [
            <a key="Bind" onClick={handleBindClick}>
              立即绑定
            </a>,
          ],
          avatar: (
            <img src={wechat} style={{ width: '48px', height: '48px' }}></img>
          ),
        }
      : {
          title: '当前绑定微信',
          description: user?.wechatNickname || '',
          actions: [
            <Button
              key="unbound"
              type="link"
              onClick={handleUnboundClick}
              loading={unbindwx.loading}
            >
              解除绑定
            </Button>,
          ],
          avatar: (
            <BsImg
              src={user?.wechatAvatarUrl || ''}
              style={{ width: '48px', height: '48px' }}
            ></BsImg>
          ),
        },
  ]

  return (
    <Fragment>
      <div>当前登录账号： {user?.phone}</div>
      <List
        itemLayout="horizontal"
        dataSource={getData()}
        renderItem={(item: any) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Fragment>
  )
}

export default BindingView
