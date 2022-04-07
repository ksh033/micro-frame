import { VdProFormColumnsType } from '../../interface';
import {
  location,
  fontSize,
  fontWeight,
  color,
  date,
} from '../../attrType/index';
import { LocationEnum } from '../../interface/enum';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';

export type TitleProps = {
  title: string;
  description?: string;
  location?: LocationEnum;
  fontSize?: number;
};
class Title extends ParentSchemCmp {
  cmpKey: string = 'Title';
  cmpName: string = '标题文本';
  propsConfig: VdProFormColumnsType[] = [
    {
      valueType: 'VdTabs',
      dataIndex: 'styleType',
      fieldProps: {
        options: [
          {
            text: '传统样式',
            value: 'old',
          },
          {
            text: '微信图文样式',
            value: 'wechat',
          },
        ],
      },
    },
    {
      title: '标题内容',
      dataIndex: 'title',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请填写标题内容',
          },
        ],
      },
    },
    {
      title: '描述内容',
      dataIndex: 'description',
    },
    {
      title: '链接标题',
      dataIndex: 'linkTitle',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请填写链接标题',
          },
        ],
      },
    },
    date,
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      ...location,
      dataIndex: 'location',
      title: '显示位置',
    },
    {
      ...fontSize,
      dataIndex: 'fontSize',
      title: '标题大小',
    },
    {
      ...fontSize,
      dataIndex: 'descriptionFontSize',
      title: '描述大小',
    },
    {
      ...fontWeight,
      dataIndex: 'fontWeight',
      title: '标题粗细',
    },
    {
      ...fontWeight,
      dataIndex: 'descriptionFontWeight',
      title: '描述粗细',
    },
    {
      ...color,
      dataIndex: 'color',
      title: '标题颜色',
      fieldProps: {
        defaultColor: '#323233',
      },
    },
    {
      ...color,
      dataIndex: 'descriptionColor',
      title: '描述颜色',
      fieldProps: {
        defaultColor: '#969799',
      },
    },
    {
      ...color,
      dataIndex: 'backgroundColor',
      title: '背景颜色',
      fieldProps: {
        defaultColor: '#fff',
      },
    },
  ];

  getPropsConfig(columns: ProFormColumnsType[], record: any) {
    const columnsMap = new Map<any, ProFormColumnsType>();
    columns.forEach((it) => {
      if (it.dataIndex) {
        columnsMap.set(it.dataIndex, it);
      }
    });
    const newColumns: ProFormColumnsType[] = [];
    const styleType = columnsMap.get('styleType');
    if (styleType) {
      newColumns.push(styleType);
    }

    const styleTypeMap = {
      old: [
        'title',
        'description',
        'location',
        'fontSize',
        'descriptionFontSize',
        'fontWeight',
        'descriptionFontWeight',
        'color',
        'descriptionColor',
        'backgroundColor',
      ],
      wechat: ['title', 'date', 'author', 'linkTitle', 'location'],
    };
    if (styleTypeMap[record['styleType']]) {
      styleTypeMap[record['styleType']].forEach((it: string) => {
        const itemColumns = columnsMap.get(it);
        if (itemColumns) {
          if (record['styleType'] === 'old' && it === 'location') {
            const options = Array.isArray(itemColumns.fieldProps.options)
              ? itemColumns.fieldProps.options
              : [];
            itemColumns.fieldProps.options = options.filter(
              (it: any) => it.value !== 'right',
            );
          }
          newColumns.push(itemColumns);
        }
      });
    }
    return newColumns;
  }
  getInitialValue() {
    return {
      styleType: 'old',
      title: '',
      description: '',
      location: 'left',
      fontSize: '16',
      fontWeight: 'bold',
      color: '#323233',
      descriptionFontSize: '16',
      descriptionFontWeight: 'normal',
      descriptionColor: '#969799',
      backgroundColor: '#fff',
    };
  }
}

Title.info = {
  icon: 'https://img.yzcdn.cn/public_files/2019/02/12/add4829af43def85a200029c3e485d77.png',
  type: ['title_text', 'title', 'text'],
  name: '标题文本',
  description: '标题文本',
  cmpKey: 'Title',
  maxNum: 20,
  usedNum: 0,
  status: '',
};

export default Title;
