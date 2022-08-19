import { VdProFormColumnsType } from '../../interface';
import { color } from '../../attrType/index';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';
import { spellNamePath } from '../../utils';

class Search extends ParentSchemCmp {
  cmpKey: string = 'Search';
  cmpName: string = '商品搜索';
  propsConfig: VdProFormColumnsType[] = [
    {
      title: '显示位置',
      dataIndex: 'position_type',
      valueType: 'VdRadioIcon',
      fieldProps: {
        options: [
          { text: '正常模式', value: '0', icon: 'deco-icon-search-normal' },
          {
            text: '滚动至顶部固定',
            value: '1',
            icon: 'deco-icon-search-sticky',
          },
        ],
      },
    },
    {
      title: '展示模式',
      dataIndex: 'position_show_method',
      valueType: 'VdRadioIcon',
      fieldProps: {
        options: [
          { text: '常驻模式', value: '0', icon: 'deco-icon-search-fixed' },
          {
            text: '上滑消失下滑出现',
            value: '1',
            icon: 'deco-icon-search-scroll',
          },
        ],
      },
    },
    {
      title: '框体样式',
      dataIndex: 'border_style_method',
      valueType: 'VdRadioIcon',
      fieldProps: {
        options: [
          { text: '方形', value: '0', icon: 'deco-icon-search-square' },
          { text: '圆形', value: '1', icon: 'deco-icon-search-round' },
        ],
      },
    },
    {
      title: '文本位置',
      dataIndex: 'text_align_method',
      valueType: 'VdRadioIcon',
      fieldProps: {
        options: [
          { text: '居左', value: 'left', icon: 'deco-icon-align-left' },
          { text: '居中', value: 'center', icon: 'deco-icon-align-center' },
        ],
      },
    },
    {
      title: '框体高度',
      valueType: 'VdSlider',
      dataIndex: 'border_style_height',
      fieldProps: {
        max: 60,
      },
    },
    {
      ...color,
      dataIndex: 'background_color',
      title: '背景颜色',
      fieldProps: {
        defaultColor: '#F9F9F9',
      },
    },
    {
      ...color,
      dataIndex: 'border_style_color',
      title: '框体颜色',
      fieldProps: {
        defaultColor: '#FFFFFF',
      },
    },
    {
      ...color,
      dataIndex: 'text_color',
      title: '文本颜色',
      fieldProps: {
        defaultColor: '#969799',
      },
    },
  ];

  getPropsConfig(columns: ProFormColumnsType<any>[], record: any) {
    const newC: any[] = columns
      .map((it: any) => {
        const dataIndex = spellNamePath(it.dataIndex);
        if (
          record['position_type'] === '0' &&
          dataIndex === 'position_show_method'
        ) {
          return null;
        }
        return it;
      })
      .filter((it) => it != null);
    return newC;
  }
  getInitialValue() {
    return {
      background_color: '#f9f9f9',
      position_type: '0',
      position_show_method: '0',
      border_style_method: '0',
      border_style_color: '#fff',
      text_color: '#969799',
      text_align_method: 'left',
      show_search_component: '1',
      border_style_height: 40,
    };
  }
}

Search.info = {
  icon: 'https://img01.yzcdn.cn/upload_files/2022/06/17/FsW9Sbp2UH3-1suib4UB-RwyaR3y.png',
  name: '商品搜索',
  description: '搜索热词和更多相关配置项请前往配置',
  cmpKey: 'Search',
  maxNum: 2,
  usedNum: 0,
  status: '',
};

export default Search;
