import { CopyOutlined, HomeOutlined, PoweroffOutlined } from '@ant-design/icons'
import { useEventListener } from 'ahooks'
import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import React, { useRef } from 'react'
import { useStore } from '../../stores'
import { ModalType } from '../../stores/editor'
import { iframeId } from '../../utils/sendToIframe'
import './index.less'
const PreView: React.FC<any> = (props) => {
  const { previewStore, editorStore } = useStore()
  const contentIFrameRef = useRef<HTMLIFrameElement>(null)
  const modalType = editorStore.modalType

  const handleClick = (type: ModalType) => {
    editorStore.changeModalType(type)
  }

  useEventListener('message', (event: any) => {
    console.log(event)
  })

  return (
    <div className="preview-wrap">
      <div className="preview-page">
        <Button
          type={modalType === 'pageSet' ? 'primary' : 'default'}
          icon={<HomeOutlined />}
          className="preview-page-options"
          onClick={() => {
            handleClick('pageSet')
          }}
        >
          页面设置
        </Button>
        <Button
          type={modalType === 'componentList' ? 'primary' : 'default'}
          icon={<CopyOutlined />}
          className="preview-page-options"
          onClick={() => {
            handleClick('componentList')
          }}
        >
          组件管理
        </Button>
      </div>
      <div className="preview">
        <div className="preview-head"></div>
        <div className="preview-content">
          <iframe
            ref={contentIFrameRef}
            id={iframeId}
            style={{ border: 0 }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            scrolling="auto"
          ></iframe>
        </div>
        <div className="preview-footer"></div>
      </div>
    </div>
  )
}
export default observer(PreView)
