import { AlignCenterOutlined, AlignLeftOutlined } from '@ant-design/icons';
import { VdProFormColumnsType } from '../interface/index';

const tagListTemplate: VdProFormColumnsType = {
  title: '展示模板',
  dataIndex: 'tagListTemplate',
  valueType: 'VdRadioIcon',
  fieldProps: {
    options: [
      { text: '顶部菜单', value: 'top', icon: 'deco-icon-menu-top' },
      { text: '左侧菜单', value: 'left', icon: 'deco-icon-menu-left' },
    ],
  },
};

export default tagListTemplate;
