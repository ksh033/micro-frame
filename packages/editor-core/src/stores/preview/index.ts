import { action, observable } from 'mobx';

export type previewStoreType = {
  iframeUrl: string;
  initIframeUrl: (iframeUrl: string) => void;
};

class PreviewClass {
  @observable iframeUrl: string = '/frame';

  // 设置iframe url的值
  @action.bound
  initIframeUrl(iframeUrl: string) {
    this.iframeUrl = iframeUrl;
  }
}
const previewStore: previewStoreType = new PreviewClass();
export default previewStore;
