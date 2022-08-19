import { VdProFormColumnsType } from '../../interface';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';
import { spellNamePath } from '../../utils';
import propsConfig from './list';
import { imageRule, textImageRule, textRule } from './rules';

const getPropsConfig = (columns: ProFormColumnsType<any>[], record: any) => {
  const newC: any[] = columns
    .map((it: any) => {
      if (Array.isArray(it.columns) && it.columns.length > 0) {
        it.columns = getPropsConfig(it.columns, record);
      } else {
        const dataIndex = spellNamePath(it.dataIndex);
        if (record['show_method'] === '0' && dataIndex === 'sub_entry') {
          return {
            ...it,
            formItemProps: {
              rules: [
                {
                  type: 'array',
                  required: true,
                  message: '请添加图文广告',
                },
                textRule,
              ],
            },
          };
        }
        if (record['show_method'] === '1' && dataIndex === 'sub_entry') {
          return {
            ...it,
            formItemProps: {
              rules: [
                {
                  type: 'array',
                  required: true,
                  message: '请添加图文广告',
                },
                textImageRule,
              ],
            },
          };
        }
        if (record['show_method'] === '2' && dataIndex === 'sub_entry') {
          return {
            ...it,
            formItemProps: {
              rules: [
                {
                  type: 'array',
                  required: true,
                  message: '请添加图文广告',
                },
                imageRule,
              ],
            },
          };
        }
      }
      return it;
    })
    .filter((it) => it != null);
  return newC;
};

class ElevatorNav extends ParentSchemCmp {
  cmpKey: string = 'ElevatorNav';
  cmpName: string = '电梯导航';
  propsConfig: VdProFormColumnsType[] = propsConfig;
  getPropsConfig = getPropsConfig;
  getInitialValue() {
    return {
      show_method: '0',
      slide_setting: '1',
      sub_entry: [
        {
          key: '0',
          title: '导航二',
          position_component: '66b8cb3a-9b6c-4427-a481-0724949421df',
          image_width: 750,
          image_height: 1037,
          image_url:
            'https://img01.yzcdn.cn/upload_files/2020/07/10/FgHKhnGPpiiiUC5xyIzfqdLEQMXo.jpg',
          link_url: null,
          use_link: '',
          image_id: '2129097636',
          image_thumb_url:
            'upload_files/2020/07/10/FgHKhnGPpiiiUC5xyIzfqdLEQMXo.jpg!100x100.jpg',
        },
        {
          key: '1',
          title: '导航四',
          position_component: '66b8cb3a-9b6c-4427-a481-0724949421df',
          image_width: 750,
          image_height: 1106,
          image_url:
            'https://img01.yzcdn.cn/upload_files/2020/07/10/Fn22ra9wQlBQvBDJO_61hwyKZqc_.jpg',
          link_url: null,
          use_link: '',
          image_id: '2129097438',
          image_thumb_url:
            'upload_files/2020/07/10/Fn22ra9wQlBQvBDJO_61hwyKZqc_.jpg!100x100.jpg',
        },
      ],
      navigation_type: '3',
      font_default_color: '#969799',
      font_active_color: '#323233',
      background_color: '#FFFFFF',
      type_color: '#EE0A24',
    };
  }
}

ElevatorNav.info = {
  icon: 'https://img01.yzcdn.cn/upload_files/2022/06/17/Fpy_YxZ69hGiYl-SUDkDn7Sz2sNH.png',
  name: '电梯导航',
  description: '只能选择当前组件下方的组件进行定位',
  cmpKey: 'ElevatorNav',
  maxNum: 1,
  usedNum: 0,
  status: '',
};

export default ElevatorNav;
