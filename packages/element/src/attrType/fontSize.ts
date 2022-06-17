import { VdProFormColumnsType } from '../interface/index';

const fontSize: VdProFormColumnsType = {
  title: '字体大小',
  valueType: 'VdRadioIcon',
  fieldProps: {
    options: [
      {
        text: '大(16号)',
        value: '16',
        icon: 'deco-icon-font-x',
      },
      {
        text: '中(14号)',
        value: '14',
        icon: 'deco-icon-font-m',
      },
      {
        text: '小(12号)',
        value: '12',
        icon: 'deco-icon-font-s',
      },
    ],
  },
};
export default fontSize;
