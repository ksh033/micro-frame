import { VdProFormColumnsType } from '../../interface';
import { location, fontSize, fontWeight, color } from '../../attrType/index';
import { LocationEnum } from '../../interface/enum';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';

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
