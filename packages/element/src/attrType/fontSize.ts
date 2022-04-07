import { FontColorsOutlined } from '@ant-design/icons';
import { VdProFormColumnsType } from '../interface/index';

const fontSize: VdProFormColumnsType = {
  title: '字体大小',
  valueType: 'VdRadioIcon',
  fieldProps: {
    options: [
      {
        text: '大(16号)',
        value: '16',
        icon: FontColorsOutlined,
        iconProps: { style: { fontSize: '16px' } },
      },
      {
        text: '中(14号)',
        value: '14',
        icon: FontColorsOutlined,
        iconProps: { style: { fontSize: '14px' } },
      },
      {
        text: '小(12号)',
        value: '12',
        icon: FontColorsOutlined,
        iconProps: { style: { fontSize: '12px' } },
      },
    ],
  },
};
export default fontSize;
