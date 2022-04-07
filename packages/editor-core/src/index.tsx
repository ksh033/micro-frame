import Frame from './editor/Frame';
import { StoreProvider } from './stores/index';
import * as Components from '@scvisual/element';

const valueTypelist: string[] = [];
Object.keys(Components).forEach((key: string) => {
  if (key.startsWith('Vd')) {
    valueTypelist.push(key);
  }
});

export { valueTypelist };
const App = (props: any) => {
  return (
    <StoreProvider>
      <Frame {...props} />
    </StoreProvider>
  );
};
export default App;
