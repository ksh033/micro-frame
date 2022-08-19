import { VdProFormColumnsType } from '../../interface';
import { spellNamePath } from '../../utils';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';
import propsConfig from './list';

class AdImage extends ParentSchemCmp {
  cmpKey: string = 'AdImage';
  cmpName: string = '图片广告';
  propsConfig: VdProFormColumnsType[] = propsConfig;
  getPropsConfig(columns: ProFormColumnsType<any>[], record: any) {
    const newC: any[] = columns
      .map((it) => {
        const dataIndex = spellNamePath(it.dataIndex);
        if (record['show_method'] !== '5' && dataIndex === 'count') {
          return null;
        }
        if (record['show_method'] !== '2' && dataIndex === 'indicator') {
          return null;
        }
        return it;
      })
      .filter((it) => it != null);
    return newC;
  }
  getInitialValue() {
    return {
      show_method: '1',
      image_style: '1',
      corner_type: '1',
      indicator: '1',
      page_margin: 0,
      image_fill_style: '1',
      count: 4,
      sub_entry: [],
    };
  }
}

AdImage.info = {
  icon: 'https://img01.yzcdn.cn/upload_files/2022/06/17/Fgyd5N9R29QGAJXE7daGUWFpdv5z.png',
  name: '图片广告',
  description: '图片广告',
  cmpKey: 'AdImage',
  maxNum: 300,
  usedNum: 0,
  status: '',
};

export default AdImage;
