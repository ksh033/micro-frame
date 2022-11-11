import { VdProFormColumnsType } from '../../interface';
import {
  location,
  fontSize,
  fontWeight,
  color,
  date,
} from '../../attrType/index';
import { ProFormColumnsType } from '@ant-design/pro-form';
import ParentSchemCmp from '../../base/ParentSchemCmp';

class Title extends ParentSchemCmp {
  cmpKey: string = 'Title';
  cmpName: string = '标题文本';
  propsConfig: VdProFormColumnsType[] = [
    {
      valueType: 'VdTabs',
      dataIndex: 'styleType',
      formItemProps: {
        className: 'deco-control-group',
        style: {
          marginBottom: '0px',
        },
      },
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
      fieldProps: {
        placeholder: '请填写标题内容',
      },
      formItemProps: {
        className: 'deco-control-group',
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
      fieldProps: {
        placeholder: '请填写描述内容',
      },
    },
    {
      title: '链接标题',
      dataIndex: 'linkTitle',
      fieldProps: {
        placeholder: '请填写链接标题',
      },
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

  getPropsConfig(columns: ProFormColumnsType<any>[], record: any) {
    const columnsMap = new Map<any, ProFormColumnsType<any>>();
    columns.forEach((it) => {
      if (it.dataIndex) {
        columnsMap.set(it.dataIndex, it);
      }
    });
    const newColumns: ProFormColumnsType<any>[] = [];
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
            if (itemColumns.fieldProps) {
              let options = itemColumns.fieldProps['options'];
              options = Array.isArray(options) ? options : [];
              itemColumns.fieldProps['options'] = options.filter(
                (it: any) => it.value !== 'right',
              );
            }
          }
          newColumns.push(itemColumns);
        }
        if (record['styleType'] === 'old' && it === 'description') {
          newColumns.push({
            valueType: 'divider',
          });
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