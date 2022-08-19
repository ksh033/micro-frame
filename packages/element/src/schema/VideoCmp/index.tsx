import { VdProFormColumnsType } from '../../interface';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';

class Video extends ParentSchemCmp {
  cmpKey: string = 'Video';
  cmpName: string = '视频';
  propsConfig: VdProFormColumnsType[] = [
    {
      title: '视频',
      dataIndex: 'type',
      valueType: 'VdRadioIcon',
      fieldProps: {
        options: [
          { text: '选择视频', value: 'white' },
          { text: '视频地址', value: 'line' },
        ],
      },
    },
  ];
  getPropsConfig(columns: ProFormColumnsType<any>[], record: any) {
    const newC: any[] = columns;
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

Video.info = {
  icon: 'https://img01.yzcdn.cn/upload_files/2022/06/17/FpyONVTUzVGqkAwqoh-RQeclXPo5.png',
  name: '视频',
  description:
    '自动播放仅小程序v2.86.7及以上版本生效，其他部分功能优化（竖版视频、隐藏进度条等）支持H5和v2.86.7及以上版本的小程序',
  cmpKey: 'Video',
  maxNum: 50,
  usedNum: 0,
  status: '',
};

export default Video;
