import { color } from '../../attrType/index';
import { VdProFormColumnsType } from '../../interface';
import { imageRule, textImageRule, textRule } from './rules';
import TagItem from './TagItem';

export const VdAddListProps = {
  title: '最多添加20个标签，鼠标拖拽调整标签顺序。图片建议尺寸100*100像素',
  addBtnText: (list: any[]) => {
    return `添加标签（${list.length}/20）`;
  },
  max: 20,
  addRecord: {},
};

const propsConfig: VdProFormColumnsType[] = [
  {
    title: '选择模板',
    dataIndex: 'show_method',
    valueType: 'VdRadioIcon',
    fieldProps: {
      block: true,
      lineBlock: true,
      options: [
        {
          text: '文字型',
          value: '0',
          icon: 'deco-icon-font-double',
        },
        {
          text: '图文型',
          value: '1',
          icon: 'deco-icon-img-text',
        },
        {
          text: '图片型',
          value: '2',
          icon: 'deco-icon-img',
        },
      ],
    },
  },
  {
    valueType: 'divider',
  },
  {
    title: '添加标签',
    valueType: 'group',
    fieldProps: { collapsible: true },
    columns: [
      {
        dataIndex: 'sub_entry',
        valueType: 'VdAddList',
        formItemProps: {
          rules: [
            {
              type: 'array',
              required: true,
              message: '请添加图文广告',
            },
            {
              ...textRule,
            },
          ],
        },
        fieldProps: (form) => {
          let type = 'text';
          if (form.getFieldValue('show_method') === '0') {
            type = 'text';
          }
          if (form.getFieldValue('show_method') === '1') {
            type = 'imageText';
          }
          if (form.getFieldValue('show_method') === '2') {
            type = 'image';
          }
          return {
            ...VdAddListProps,
            renderItem: (props: any) => {
              return <TagItem {...props} type={type}></TagItem>;
            },
          };
        },
      },
    ],
  },
  {
    valueType: 'divider',
  },
  {
    title: '标签样式',
    valueType: 'group',
    fieldProps: { collapsible: true },
    columns: [
      {
        title: '展示方式',
        dataIndex: 'slide_setting',
        valueType: 'VdRadioIcon',
        fieldProps: {
          showValue: false,
          options: [
            {
              text: '下拉展示',
              value: '0',
            },
            {
              text: '横向滚动',
              value: '1',
            },
          ],
        },
      },
      {
        title: '标签样式',
        dataIndex: 'navigation_type',
        valueType: 'VdRadioIcon',
        fieldProps: {
          showValue: false,
          options: [
            {
              text: '背景模式',
              value: '0',
            },
            {
              text: '圆框',
              value: '1',
            },
            {
              text: '方框',
              value: '2',
            },
            {
              text: '下划线',
              value: '3',
            },
          ],
        },
      },
      {
        ...color,
        dataIndex: 'font_default_color',
        title: '文本颜色-默认状态',
        fieldProps: {
          defaultColor: '#969799',
        },
      },
      {
        ...color,
        dataIndex: 'font_active_color',
        title: '文本颜色-选中状态',
        fieldProps: {
          defaultColor: '#e5e5e5',
        },
      },
      {
        ...color,
        dataIndex: 'type_color',
        title: '圆框颜色',
        fieldProps: {
          defaultColor: '#EE0A24',
        },
      },
      {
        ...color,
        dataIndex: 'background_color',
        title: '背景颜色',
        fieldProps: {
          defaultColor: '#ffffff',
        },
      },
    ],
  },
];

export default propsConfig;
