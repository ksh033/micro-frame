import { VdProFormColumnsType } from '../interface/index';

const fontSize: VdProFormColumnsType = {
  title: '填充',
  valueType: 'VdRadioIcon',
  fieldProps: {
    options: [
      {
        text: '填充',
        value: '1',
        icon: 'deco-icon-img-cover',
      },
      {
        text: '周边留白',
        value: '2',
        icon: 'deco-icon-img-contain',
      },
    ],
  },
};
export default fontSize;
