import { ButtonTypeProps } from '@scboson/sc-schema/es/interface'
import defaultEvents from '@scboson/sc-schema/es/event/DefaultEvents'
import { useRequest } from 'ahooks'
import { Button, ButtonProps } from 'antd'
import React from 'react'

const BsTableButton: React.FC<ButtonTypeProps> = (props) => {
  const {
    text,
    options,
    onClick,
    buttonType,
    type = 'link',
    disabled = false,
    htmlType = 'button',
    icon,
  } = props
  const buttonProps: ButtonProps = {
    onClick: onClick,
    type: type,
    disabled: disabled,
    htmlType: htmlType,
  }

  const service = options && options.service ? options.service : {}
  const request = useRequest(service, { manual: true, throwOnError: true })
  const newOptions = options
  if (newOptions?.service) {
    newOptions.service = request.run
    buttonProps.loading = request.loading
  }

  if (!buttonProps.onClick && buttonType && defaultEvents[buttonType]) {
    const itemEvent = defaultEvents[buttonType]

    let callBack: ((values: any) => void) | null = null
    let preHandle: ((values: any) => boolean) | null = null
    // 默认的回调方法
    if (props?.callBack) {
      callBack = props?.callBack
    } else if (options?.callBack) {
      callBack = options.callBack
    }

    if (props?.preHandle) {
      preHandle = props?.preHandle
    } else if (options?.preHandle) {
      preHandle = options.preHandle
    }

    buttonProps.onClick = (...arg) => {
      const event: any = arg.length > 0 ? arg[arg.length - 1] : null
      // 彈出框处理
      if (newOptions?.content) {
        if (newOptions.pageProps && !newOptions.pageProps.callBack) {
          newOptions.pageProps.callBack = callBack
        }
      }
      itemEvent(
        {
          ...buttonProps,
          options: newOptions,
          callBack,
          preHandle,
        },
        event
      )
    }
  }

  return (
    <Button {...buttonProps}>
      {icon ? icon : null}
      {text}
    </Button>
  )
}

export default BsTableButton
