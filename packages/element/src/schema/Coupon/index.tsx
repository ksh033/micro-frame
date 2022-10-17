import { VdProFormColumnsType } from '../../interface';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';
import { spellNamePath } from '../../utils';
import propsConfig from './list';

class Coupon extends ParentSchemCmp {
  cmpKey: string = 'Coupon';
  cmpName: string = '优惠券';
  propsConfig: VdProFormColumnsType[] = propsConfig;
  getPropsConfig(columns: ProFormColumnsType<any>[], record: any) {
    const newC: any[] = columns
      .map((it) => {
        const dataIndex = spellNamePath(it.dataIndex);
        if (record['coupon_source'] === '1' && dataIndex === 'couponSet') {
          return null;
        }
        if (record['coupon_source'] === '2' && dataIndex === 'coupon') {
          return null;
        }
        return it;
      })
      .filter((it) => it != null);
    return newC;
  }
  getInitialValue() {
    return {
      coupon: [],
      coupon_source: '1',
      coupon_num: 0,
      hide_unshared_coupon: '0',
      hide_empty_coupon: '1',
      hide_unopen_coupon: '0',
      coupon_style: '5',
      coupon_color: '1',
      title_type: '0',
      title_value: '',
      load_more: '0',
      uuid: '0e71bf09-97b2-4c81-941c-cc8dfaecd70e',
      layout: '4',
    };
  }
}

Coupon.info = {
  icon: 'https://img01.yzcdn.cn/upload_files/2022/06/17/FupnImjncvDfovyPfalWjuTCEklH.png',
  name: '优惠券',
  cmpKey: 'Coupon',
  maxNum: 50,
  usedNum: 0,
  status: '',
};

export default Coupon;
