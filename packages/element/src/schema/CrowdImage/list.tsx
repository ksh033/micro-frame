import { VdProFormColumnsType } from '../../interface';
import Item from './Item';

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
          text: '单图模式',
          value: '0',
          icon: 'deco-icon-up2end',
        },
        {
          text: '轮播模式',
          value: '1',
          icon: 'deco-icon-carousel',
        },
      ],
    },
  },
  {
    valueType: 'divider',
  },
  {
    dataIndex: 'sub_entry',
    valueType: 'VdAddList',
    formItemProps: {
      rules: [
        {
          type: 'array',
          required: true,
          message: '请添加人群图片',
        },
      ],
    },
    fieldProps: {
      addBtnText: (filds: any[]) => {
        return `添加图片(${filds.length}/5)`;
      },
      renderItem: (record: any, index: number) => {
        return <Item record={record} key={index}></Item>;
      },
      max: 5,
      addRecord: {
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
      content: (
        <div>
          <div key="title">最多添加 5 个广告。</div>
          <div key="content">
            所有图片将针对不同人群在同一位置展示，若同一用户满足多个图片展示条件，则展示第一张，可拖动图片顺序改变优先级
          </div>
        </div>
      ),
      title: '添加图片',
    },
  },
  {
    valueType: 'divider',
  },
  {
    dataIndex: 'image_style',
    title: '图片样式',
    valueType: 'VdRadioIcon',
    fieldProps: {
      options: [
        {
          text: '常规',
          value: '1',
          icon: 'deco-icon-image-ad-normal',
        },
        {
          text: '投影',
          value: '2',
          icon: 'deco-icon-shadow',
        },
      ],
    },
  },
  {
    dataIndex: 'corner_type',
    title: '图片倒角',
    valueType: 'VdRadioIcon',
    fieldProps: {
      options: [
        {
          text: '直角',
          value: '1',
          icon: 'deco-icon-corner-straight',
        },
        {
          text: '圆角',
          value: '2',
          icon: 'deco-icon-corner-round',
        },
      ],
    },
  },
  {
    dataIndex: 'indicator',
    title: '指示器',
    valueType: 'VdRadioIcon',
    fieldProps: {
      options: [
        {
          text: '样式一',
          value: '1',
          icon: 'deco-icon-indicator-1',
        },
        {
          text: '样式二',
          value: '2',
          icon: 'deco-icon-indicator-2',
        },
        {
          text: '样式三',
          value: '3',
          icon: 'deco-icon-indicator-3',
        },
        {
          text: '样式四',
          value: '4',
          icon: 'deco-icon-indicator-4',
        },
      ],
    },
  },
  {
    title: '页面边距',
    valueType: 'VdSlider',
    dataIndex: 'page_margin',
    fieldProps: {
      max: 30,
    },
  },
];

export default propsConfig;
