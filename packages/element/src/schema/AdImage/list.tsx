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
          text: '一行一个',
          value: '1',
          icon: 'deco-icon-up2end',
        },
        {
          text: '轮播海报',
          value: '2',
          icon: 'deco-icon-carousel',
        },
        {
          text: '大图横向滑动',
          value: '3',
          icon: 'deco-icon-carousel',
        },
        {
          text: '小图横向滑动',
          value: '4',
          icon: 'deco-icon-carousel',
        },
        {
          text: '导航横向滑动',
          value: '5',
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
          message: '请添加广告图片',
        },
      ],
    },
    fieldProps: {
      addBtnText: (filds: any[]) => {
        return `添加背景图`;
      },
      renderItem: (record: any) => {
        return <Item record={record}></Item>;
      },
      max: 10,
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
            最多添加 10 个广告，鼠标拖拽调整广告顺序，建议宽度750像素
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
    dataIndex: 'count',
    valueType: 'VdRadioGroup',
    title: '一屏显示',
    formItemProps: {
      className: 'deco-control-group',
      style: {
        marginBottom: '8px',
      },
    },
    fieldProps: {
      options: [
        { value: 4, label: '4张图片' },
        { value: 5, label: '5张图片' },
        { value: 6, label: '6张图片' },
      ],
    },
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
    dataIndex: 'image_fill_style',
    title: '填充方式',
    valueType: 'VdRadioIcon',
    fieldProps: {
      options: [
        {
          text: '填充',
          value: '1',
          icon: 'deco-icon-img-cover',
        },
        {
          text: '周边留白',
          value: '2',
          icon: 'deco-icon-img-contain',
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
