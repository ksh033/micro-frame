import Frame from './editor/Frame';
import { StoreProvider } from './stores/index';
// @ts-ignore
import * as Components from '@scvisual/element';
import './index.less';

const valueTypelist: string[] = [];
Object.keys(Components).forEach((key: string) => {
  if (key.startsWith('Vd')) {
    valueTypelist.push(key);
  }
});
const iframeId = 'myFrame';
export { valueTypelist, iframeId };

const App = (props: any) => {
  return (
    <StoreProvider>
      <Frame {...props} />
    </StoreProvider>
  );
};
export default App;
