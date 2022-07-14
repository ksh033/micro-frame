import { VdProFormColumnsType } from '../interface/index';

const fontWeight: VdProFormColumnsType = {
  title: '加粗',
  valueType: 'VdRadioIcon',
  fieldProps: {
    options: [
      {
        text: '常规体',
        value: 'normal',
        icon: 'deco-icon-font-regular',
      },
      {
        text: '加粗体',
        value: 'bold',
        icon: 'deco-icon-font-bold',
      },
    ],
  },
};
export default fontWeight;
