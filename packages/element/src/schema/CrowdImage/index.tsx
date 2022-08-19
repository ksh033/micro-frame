import { VdProFormColumnsType } from '../../interface';
import { spellNamePath } from '../../utils';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';
import propsConfig from './list';

class CrowdImage extends ParentSchemCmp {
  cmpKey: string = 'CrowdImage';
  cmpName: string = '人群图片';
  propsConfig: VdProFormColumnsType[] = propsConfig;

  getPropsConfig(columns: ProFormColumnsType<any>[], record: any) {
    const newC: any[] = columns
      .map((it) => {
        const dataIndex = spellNamePath(it.dataIndex);
        if (record['show_method'] === '0' && dataIndex === 'indicator') {
          return null;
        }
        return it;
      })
      .filter((it) => it != null);
    return newC;
  }
  getInitialValue() {
    return {
      show_method: '0',
      image_style: '1',
      corner_type: '1',
      indicator: '1',
      page_margin: 0,
      sub_entry: [],
    };
  }
}

CrowdImage.info = {
  icon: 'https://img01.yzcdn.cn/upload_files/2022/06/17/Fgyd5N9R29QGAJXE7daGUWFpdv5z.png',
  name: '人群图片',
  description: '',
  cmpKey: 'CrowdImage',
  maxNum: 1,
  usedNum: 0,
  status: '',
};

export default CrowdImage;
