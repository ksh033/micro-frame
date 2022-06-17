import { VdProFormColumnsType } from '../interface/index';

const location: VdProFormColumnsType = {
  title: '显示位置',
  dataIndex: 'location',
  valueType: 'VdRadioIcon',
  fieldProps: {
    options: [
      { text: '居左显示', value: 'left', icon: 'deco-icon-align-left' },
      { text: '居中显示', value: 'center', icon: 'deco-icon-align-center' },
      { text: '居右显示', value: 'right', icon: 'deco-icon-align-right' },
    ],
  },
};

export default location;
