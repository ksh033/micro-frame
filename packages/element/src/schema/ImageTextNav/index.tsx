import { VdProFormColumnsType } from '../../interface';
import { spellNamePath } from '../../utils';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp, { FormProps } from '../../base/ParentSchemCmp';
import propsConfig from './list';

class ImageTextNav extends ParentSchemCmp {
  cmpKey: string = 'ImageTextNav';
  cmpName: string = '图文导航';
  formProps: FormProps = {
    layout: 'horizontal',
    shouldUpdate: (newValues, oldValues) => {
      if (
        newValues &&
        oldValues &&
        newValues['show_method'] !== oldValues['show_method']
      ) {
        return true;
      }
      return false;
    },
  };
  propsConfig: VdProFormColumnsType[] = propsConfig;
  getPropsConfig(columns: ProFormColumnsType<any>[], record: any) {
    const newC: any[] = columns
      .map((it: any) => {
        const dataIndex = spellNamePath(it.dataIndex);
        if (record['image_fill_style'] === '1' && dataIndex === 'count') {
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
      image_fill_style: '1',
      sub_entry: [
        {
          key: '1',
          image_id: '2129097438',
          image_url:
            'https://img01.yzcdn.cn/upload_files/2020/07/10/Fn22ra9wQlBQvBDJO_61hwyKZqc_.jpg',
          image_thumb_url:
            'upload_files/2020/07/10/Fn22ra9wQlBQvBDJO_61hwyKZqc_.jpg!100x100.jpg',
          image_width: 750,
          image_height: 1106,
          link_url:
            'https://shop90759155.youzan.com/wscshop/showcase/feature?alias=kTSNCfsvO5',
        },
        {
          key: '2',
          image_id: '2129097438',
          image_url:
            'https://img01.yzcdn.cn/upload_files/2020/07/10/Fn22ra9wQlBQvBDJO_61hwyKZqc_.jpg',
          image_thumb_url:
            'upload_files/2020/07/10/Fn22ra9wQlBQvBDJO_61hwyKZqc_.jpg!100x100.jpg',
          image_width: 750,
          image_height: 1106,
          link_url:
            'https://shop90759155.youzan.com/wscshop/showcase/feature?alias=kTSNCfsvO5',
        },
      ],
      background_color: '#fff',
      color: '#000',
      count: 4,
      page_margin: 10,
    };
  }
}

ImageTextNav.info = {
  icon: 'https://img01.yzcdn.cn/upload_files/2022/06/17/FnCMmkIRcBPKq5oeY8kX7lq_7hk4.png',
  name: '图文导航',
  description: '图文导航',
  cmpKey: 'ImageTextNav',
  maxNum: 10,
  usedNum: 0,
  status: '',
};

export default ImageTextNav;
