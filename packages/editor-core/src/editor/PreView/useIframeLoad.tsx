import { useEffect, useState } from 'react';
import { iframeId } from '../../index';

function useIframeLoad() {
  const [iframeState, setIframeState] = useState(false);
  const [windowState, setWindowState] = useState(
    document.readyState === 'complete',
  );

  const iframeLoad = () => {
    const iframeEle: any = document.getElementById(iframeId);
    if (iframeEle) {
      const doc = iframeEle.contentDocument;
      if (doc) {
        setIframeState(doc?.readyState === 'complete');
      }
    }
    if (!iframeState && iframeEle) {
      iframeEle.onload = () => {
        setIframeState(true);
      };
    }
  };
  useEffect(() => {
    if (!windowState) {
      setIframeState(false);
      window.addEventListener('load', () => {
        setWindowState(true);
        iframeLoad();
      });
    } else {
      iframeLoad();
    }
  }, []);
  return iframeState;
}

export type UseIframeLoad = typeof useIframeLoad;

export type UseIframeLoadType = ReturnType<UseIframeLoad>;

export default useIframeLoad;
