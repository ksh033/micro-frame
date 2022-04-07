import React, { useRef } from 'react'
import { CmpInfo } from '@scvisual/element'
import { useHover } from 'ahooks'
import { observer } from 'mobx-react-lite'

interface ComItemProps {
  item: CmpInfo
  onClick?: Function
  regeditCmpName: string
}
const ComItem: React.FC<ComItemProps> = (props) => {
  const {
    item: { name, icon, maxNum, usedNum },
    regeditCmpName,
    onClick,
  } = props

  const ref = useRef<any>()
  const isHovering = useHover(ref)

  const itemDragStartHandler = (event: React.DragEvent<HTMLDivElement>) => {
    onClick?.(event, regeditCmpName)
  }
  return (
    <div
      ref={ref}
      className={isHovering ? 'com-item com-item-active' : 'com-item'}
      onClick={itemDragStartHandler}
    >
      <i
        className="com-item-icon"
        style={{ backgroundImage: `url(${icon})` }}
      ></i>
      <div className="com-item-name">{name}</div>
      <div className="com-item-num">
        {usedNum}/{maxNum}
      </div>
    </div>
  )
}

export default observer(ComItem)
