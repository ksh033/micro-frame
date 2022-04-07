import { FontSizeOutlined } from '@ant-design/icons';
import { VdProFormColumnsType } from '../interface/index';

const fontWeight: VdProFormColumnsType = {
  title: '加粗',
  valueType: 'VdRadioIcon',
  fieldProps: {
    options: [
      {
        text: '常规体',
        value: 'normal',
        icon: FontSizeOutlined,
        iconProps: { style: { fontWeight: 'normal' } },
      },
      {
        text: '加粗体',
        value: 'bold',
        icon: FontSizeOutlined,
        iconProps: { style: { fontSize: 'bold' } },
      },
    ],
  },
};
export default fontWeight;
