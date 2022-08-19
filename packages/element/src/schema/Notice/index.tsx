import { VdProFormColumnsType } from '../../interface';
import { color } from '../../attrType/index';
import ParentSchemCmp from '../../base/ParentSchemCmp';

class Notice extends ParentSchemCmp {
  cmpKey: string = 'Notice';
  cmpName: string = '公告';
  propsConfig: VdProFormColumnsType[] = [
    {
      title: '公告',
      dataIndex: 'content',
      fieldProps: {
        placeholder: '请填写公告内容',
      },
      formItemProps: {
        className: 'deco-control-group',
        rules: [
          {
            required: true,
            message: '请填写公告内容',
          },
        ],
      },
    },
    {
      ...color,
      dataIndex: 'bg_color',
      title: '背景颜色',
      fieldProps: {
        defaultColor: '#fff8e9',
      },
    },
    {
      ...color,
      dataIndex: 'color',
      title: '文本颜色',
      fieldProps: {
        defaultColor: '#646566',
      },
    },
  ];
  getInitialValue() {
    return {
      content: '',
      bg_color: '#fff8e9',
      color: '#646566',
    };
  }
}

Notice.info = {
  icon: 'https://img01.yzcdn.cn/upload_files/2022/06/17/FlcvwSqlns7YVxDk8Zi2yAG6oEji.png',
  name: '公告',
  cmpKey: 'Notice',
  maxNum: 1,
  usedNum: 0,
  status: '',
};

export default Notice;
