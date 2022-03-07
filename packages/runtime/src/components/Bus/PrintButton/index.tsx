import React from 'react'
import { Menu, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { print, PrintTplType, setPrintSetting } from '../../../utils/print'
import style from './index.less'

export const PrintType = PrintTplType
export interface PrintButtonProp {
  printType: PrintTplType | string
  form?: any
  children?: any
  preview: boolean
  callBack?: Function
  getParams?: () => {}
}
/**
 * 字典控件
 *
 * @param pros 字典控件属性
 */
const PrintButton: React.FC<any> = (pros: PrintButtonProp) => {
  const {
    printType,
    form,
    preview = false,
    children,
    getParams,
    callBack,
    ...restProps
  } = pros

  const getParam = () => {
    let params = {}
    if (getParams) {
      params = getParams()
    }
    return params
  }
  const printClcik = async () => {
    const params = await getParam()
    const result = await print(printType, { params, preview })
    if (preview === false) {
      if (result) {
        callBack && callBack()
      }
    }
  }

  const menuClick = async (obj: any) => {
    const params = await getParam()

    if (obj.key === 'priview') {
      print(printType, { params, preview: true })
    }

    if (obj.key === 'setting') {
      setPrintSetting(printType)
    }
  }

  const menu = (
    <Menu onClick={menuClick} style={{ zIndex: 999 }}>
      <Menu.Item key="priview">打印预览</Menu.Item>
      <Menu.Item key="setting">打印设置</Menu.Item>
    </Menu>
  )
  return (
    <Dropdown.Button
      className={style['print-btn']}
      onClick={() => {
        printClcik()
      }}
      icon={<DownOutlined></DownOutlined>}
      overlay={menu}
      style={{ padding: '0px' }}
      trigger={['click']}
      // @ts-ignore
      getPopupContainer={(node: any) => {
        const footer = document.getElementsByClassName('ant-pro-footer-bar')
        if (footer.length > 0) {
          return footer.item(0)
        } else {
          return document.body
        }
      }}
      {...restProps}
    >
      {children || '打印'}
    </Dropdown.Button>
  )
}
export default PrintButton
