import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
} from '@ant-design/icons';
import { VdProFormColumnsType } from '../interface/index';

const location: VdProFormColumnsType = {
  title: '显示位置',
  dataIndex: 'location',
  valueType: 'VdRadioIcon',
  fieldProps: {
    options: [
      { text: '居左显示', value: 'left', icon: AlignLeftOutlined },
      { text: '居中显示', value: 'center', icon: AlignCenterOutlined },
      { text: '居右显示', value: 'right', icon: AlignRightOutlined },
    ],
  },
};

export default location;
