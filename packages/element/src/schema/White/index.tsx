import { VdProFormColumnsType } from '../../interface';
import { color } from '../../attrType/index';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';
import { spellNamePath } from '../../utils';

class White extends ParentSchemCmp {
  cmpKey: string = 'White';
  cmpName: string = '辅助空白';
  propsConfig: VdProFormColumnsType[] = [
    {
      title: '分割类型',
      dataIndex: 'type',
      valueType: 'VdRadioIcon',
      fieldProps: {
        options: [
          { text: '辅助空白', value: 'white', icon: 'deco-icon-white' },
          { text: '辅助线', value: 'line', icon: 'deco-icon-line' },
        ],
      },
    },
    {
      title: '选择样式',
      dataIndex: 'lineType',
      valueType: 'VdRadioIcon',
      fieldProps: {
        options: [
          { text: '实线', value: 'solid', icon: 'deco-icon-line-solid' },
          { text: '虚线', value: 'dashed', icon: 'deco-icon-line-dashed' },
          { text: '点线', value: 'dotted', icon: 'deco-icon-line-dotted' },
        ],
      },
    },
    {
      title: '左右边距',
      dataIndex: 'hasPadding',
      valueType: 'VdRadioIcon',
      fieldProps: {
        options: [
          { text: '无边距', value: '0', icon: 'deco-icon-line-no-padding' },
          { text: '左右留边', value: '1', icon: 'deco-icon-line-padding' },
        ],
      },
    },
    {
      ...color,
      dataIndex: 'color',
      title: '辅助线颜色',
      fieldProps: {
        defaultColor: '#e5e5e5',
      },
    },
    {
      title: '空白高度',
      valueType: 'VdSlider',
      dataIndex: 'height',
      fieldProps: {
        max: 100,
      },
    },
  ];

  getPropsConfig(columns: ProFormColumnsType<any>[], record: any) {
    const newC: any[] = columns
      .map((it: any) => {
        const dataIndex = spellNamePath(it.dataIndex);
        const whiteSet = new Set(['lineType', 'hasPadding', 'color']);
        if (record['type'] === 'white' && whiteSet.has(dataIndex)) {
          return null;
        }
        if (record['type'] === 'line' && dataIndex === 'height') {
          return null;
        }
        return it;
      })
      .filter((it) => it != null);
    return newC;
  }
  getInitialValue() {
    return {
      height: 30,
      type: 'white',
      lineType: 'solid',
      hasPadding: '0',
      color: '#e5e5e5',
    };
  }
}

White.info = {
  icon: 'https://img01.yzcdn.cn/upload_files/2022/06/17/FutbH839K4gGvY6azrrtJHYDxVqK.png',
  name: '辅助分割',
  cmpKey: 'White',
  maxNum: 50,
  usedNum: 0,
  status: '',
};

export default White;
