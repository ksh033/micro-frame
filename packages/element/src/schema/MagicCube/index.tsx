import { VdProFormColumnsType } from '../../interface';
import { LocationEnum } from '../../interface/enum';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';
import VdIcon from '../../components/VdIcon';

export type MagicCubeProps = {
  title: string;
  description?: string;
  location?: LocationEnum;
  fontSize?: number;
};
class MagicCube extends ParentSchemCmp {
  cmpKey: string = 'MagicCube';
  cmpName: string = '魔方';
  propsConfig: VdProFormColumnsType[] = [
    {
      title: '选择模板',
      dataIndex: 'showMethod',
      valueType: 'VdRadioIcon',
      fieldProps: {
        block: true,
        options: [
          {
            text: '一行二个',
            value: '0',
            icon: <VdIcon type="vd-template-yihangerge" />,
          },
          {
            text: '一行三个',
            value: '1',
          },
          {
            text: '一行四个',
            value: '2',
          },
          {
            text: '二左二右',
            value: '3',
          },
          {
            text: '一左二右',
            value: '4',
          },
          {
            text: '一上二下',
            value: '5',
          },
          {
            text: '一左三右',
            value: '6',
          },
          {
            text: '自定义',
            value: '7',
          },
        ],
      },
    },
    {
      title: '图片间距',
      valueType: 'VdSlider',
      dataIndex: 'gutter',
      fieldProps: {
        max: 30,
      },
    },
    {
      title: '页面间距',
      valueType: 'VdSlider',
      dataIndex: 'margin',
      fieldProps: {
        max: 30,
      },
    },
  ];

  getPropsConfig(columns: ProFormColumnsType[], record: any) {
    return columns;
  }
  getInitialValue() {
    return {
      gutter: 0,
      margin: 30,
      showMethod: '0',
    };
  }
}

MagicCube.info = {
  icon: 'https://img01.yzcdn.cn/public_files/2019/02/12/6c2cc2100fa2db454aaf649c19e0ffc9.png',
  name: '魔方',
  description: '魔方',
  cmpKey: 'MagicCube',
  maxNum: 200,
  usedNum: 0,
  status: '',
};

export default MagicCube;
