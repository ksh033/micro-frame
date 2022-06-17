import ParentSchemCmp, { FormProps } from '../../base/ParentSchemCmp';
import { VdProFormColumnsType } from '../../interface';
import { LocationEnum } from '../../interface/enum';
import { ProFormColumnsType } from '@ant-design/pro-form';
import propsConfig from './list';
import { spellNamePath } from '../../utils';
import GroupTitle from '../../components/VdGoodsGroup/GroupTitle';

export type MagicCubeProps = {
  title: string;
  description?: string;
  location?: LocationEnum;
  fontSize?: number;
};

class Goods extends ParentSchemCmp {
  cmpKey: string = 'Goods';
  cmpName: string = '商品';
  propsConfig: VdProFormColumnsType[] = propsConfig;
  formProps: FormProps = {
    layout: 'horizontal',
  };
  getPropsConfig(columns: ProFormColumnsType<any>[], record: any) {
    const goodsColumns = ['goods_from', 'goods', 'sub_entry'];
    const newC: any[] = columns
      .map((it) => {
        const dataIndex = spellNamePath(it.dataIndex);
        if (goodsColumns.indexOf(dataIndex) > -1) {
          if (record.type === 'goods') {
            if (dataIndex === 'goods_from') {
              return it;
            }
            if (record['goods_from'] === '0' && dataIndex === 'goods') {
              return {
                ...it,
                formItemProps: {
                  className: 'deco-control-style-group',
                  style: {
                    marginBottom: '24px',
                  },
                  required: false,
                  rules: [
                    {
                      required: true,
                      message: '请添加商品',
                      type: 'array',
                    },
                  ],
                },
              };
            }

            if (record['goods_from'] === '1' && dataIndex === 'sub_entry') {
              return {
                ...it,
                fieldProps: {
                  max: 1,
                  type: 'tag',
                },
              };
            }
          } else {
            if (dataIndex === 'sub_entry') {
              return {
                ...it,
                fieldProps: {
                  max: 15,
                  groupTitle: () => {
                    return <GroupTitle></GroupTitle>;
                  },
                },
              };
            }
          }
          return null;
        }
        return it;
      })
      .filter((it) => it != null);
    console.log(newC);
    return newC;
  }
  getInitialValue() {
    return {
      tag_list_template: 'top',
      type: 'goods',
      goods_from: '0',
      is_show_all: '0',
      goods_type: '0',
      goods_style: '0',
      border_radius_type: '1',
      display_scale: '0',
      image_fill_style: '1',
      text_style_type: 'normal',
      text_align_type: 'left',
      page_margin: 15,
      goods_margin: 10,
      goods_name: '1',
      goods_description: '1',
      goods_price: '1',
      show_corner_mark: '1',
      buy_btn: '1',
      nav_style: '1',
      sticky: '0',
      buy_btn_express: {
        btn_type: '1',
      },
    };
  }
}

Goods.info = {
  icon: 'https://img01.yzcdn.cn/public_files/2019/02/12/a6806f6ff8c220aa7a57eb89d253e126.png',
  name: '商品',
  description: '小程序仅支持显示实物（含分销）、虚拟、电子卡券商品',
  cmpKey: 'Goods',
  maxNum: 100,
  usedNum: 0,
  status: '',
};

export default Goods;
