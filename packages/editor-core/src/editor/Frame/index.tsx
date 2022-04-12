import React, { useLayoutEffect } from 'react';
import { observer, useObserver } from 'mobx-react-lite';
import './index.less';

import TopBar from '../TopBar';
import ComsPanel from '../ComsPanel';
import PropertyPanel from '../PropertyPanel';
import PreView from '../PreView';
import { useStore } from '../../stores';

type FrameProps = {
  iframeUrl?: string;
};

const Frame: React.FC<FrameProps> = (props) => {
  const { previewStore } = useStore();

  useLayoutEffect(() => {
    if (props?.iframeUrl) {
      previewStore.initIframeUrl(props?.iframeUrl);
    }
  }, []);

  return useObserver(() => (
    <div className="editor-wrapper">
      <TopBar></TopBar>
      <ComsPanel></ComsPanel>
      <PreView></PreView>
      <PropertyPanel></PropertyPanel>
    </div>
  ));
};

export default observer(Frame);
