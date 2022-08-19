import { VdProFormColumnsType } from '../../interface';
import ParentSchemCmp from '../../base/ParentSchemCmp';

class Store extends ParentSchemCmp {
  cmpKey: string = 'Store';
  cmpName: string = '进入店铺';
  propsConfig: VdProFormColumnsType[] = [
    {
      title: '文案',
      dataIndex: 'action_text',
      formItemProps: {
        className: 'deco-control-group',
      },
    },
  ];
  getInitialValue() {
    return {
      action_text: '进入店铺',
    };
  }
}

Store.info = {
  icon: 'https://img01.yzcdn.cn/upload_files/2022/06/17/Fi8Zam5inptsK9I4E2TDKsFoZCNq.png',
  name: '进入店铺',
  cmpKey: 'Store',
  maxNum: 1,
  usedNum: 0,
  status: '',
};

export default Store;
