import { ButtonTypeProps, HButtonType } from '@scboson/sc-schema/es/interface'
import { Button, Divider, Dropdown, Menu } from 'antd'
import React, { useCallback } from 'react'
import BsTableButton from './BsTableButton'
import { DownOutlined } from '@ant-design/icons'

export interface OperationProps {
  max: number
  record: any
  buttons: ButtonTypeProps[]
  config: any
  reload: () => void
}

const Operation: React.FC<OperationProps> = (props) => {
  const { buttons, max = 4 } = props

  const renderChild = useCallback(() => {
    const children: any[] = []
    const moreButtons: any[] = []
    const moreButtonsClick: any = {}
    const { length } = buttons
    buttons.forEach((item: ButtonTypeProps, index: number) => {
      const { text } = item
      const iconObj = item.icon ? item.icon : null
      if (index < max) {
        children.push(<BsTableButton {...item} key={`bt_${index}`} />)
        if (index !== length - 1) {
          // eslint-disable-next-line react/no-array-index-key
          children.push(<Divider key={`d_${index}`} type="vertical" />)
        }
      } else {
        // moreButtonsClick[index] = {
        //   onClick: (e: any) => {},
        // }
        moreButtons.push(
          // eslint-disable-next-line react/no-array-index-key
          <Menu.Item key={index}>
            <BsTableButton
              {...item}
              key={`bt_${index}`}
              type="text"
              style={{ padding: 0 }}
            />
          </Menu.Item>
        )
      }
    })
    // const dropDownClick = ({ key }: any) => {
    //   if (moreButtonsClick[key]) {
    //     moreButtonsClick[key].onClick && moreButtonsClick[key].onClick()
    //   }
    // }
    if (moreButtons.length > 0) {
      const menu = <Menu>{moreButtons}</Menu>
      children.push(
        <Dropdown key={'moreBtn'} overlay={menu}>
          <Button type="link">
            更多
            <DownOutlined />
          </Button>
        </Dropdown>
      )
    }

    return children
  }, [buttons, max])

  return (
    <div className={'sc-table-operation'} style={{ display: 'inline-block' }}>
      {renderChild()}
    </div>
  )
}

export default React.memo(Operation)
