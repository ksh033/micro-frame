import React from 'react'
import { observer, useObserver } from 'mobx-react-lite'
import './index.less'

import TopBar from '../TopBar'
import ComsPanel from '../ComsPanel'
import PropertyPanel from '../PropertyPanel'
import PreView from '../PreView'

const Frame: React.FC<any> = (props) => {
  return useObserver(() => (
    <div className="editor-wrapper">
      <TopBar></TopBar>
      <ComsPanel></ComsPanel>
      <PreView></PreView>
      <PropertyPanel></PropertyPanel>
    </div>
  ))
}

export default observer(Frame)
