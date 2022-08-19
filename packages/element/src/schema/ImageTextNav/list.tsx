import { VdProFormColumnsType } from '../../interface';
import { color } from '../../attrType/index';
import VdImgLink from '../../components/VdImgLink';

export const VdAddListProps = {
  title: '最多添加 10 个导航，拖动选中的导航可对其排序',
  addBtnText: '添加图文导航',
  renderItem: (props: any) => {
    return <VdImgLink {...props}></VdImgLink>;
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
};

const propsConfig: VdProFormColumnsType[] = [
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
        ({ getFieldValue }) => ({
          type: 'object',
          validator(_, value, callback) {
            if (value != null && Array.isArray(value) && value.length > 0) {
              const show_method = getFieldValue('show_method');
              let noImage = false;
              let noTitle = false;
              value.forEach((it: any) => {
                if (it['image_url'] == null && noImage === false) {
                  noImage = true;
                }
                if (
                  (it['link_title'] == null || it['link_title'] == '') &&
                  noTitle === false
                ) {
                  noTitle = true;
                }
              });
              if (show_method == '1' && noImage) {
                callback('请选择一张图片');
              }
              if (show_method == '2' && noTitle) {
                callback('标题不能为空');
              }
            }
            callback();
          },
        }),
      ],
    },
    fieldProps: (form) => {
      if (form.getFieldValue('show_method') === '2') {
        return {
          ...VdAddListProps,
          renderItem: (props: any) => {
            return <VdImgLink {...props} needImage={false}></VdImgLink>;
          },
        };
      } else {
        return VdAddListProps;
      }
    },
  },
  {
    valueType: 'divider',
  },
  {
    dataIndex: 'show_method',
    valueType: 'VdRadioGroup',
    title: '选择模板',
    formItemProps: {
      className: 'deco-control-group',
      style: {
        marginBottom: '8px',
      },
    },
    fieldProps: {
      options: [
        { value: '1', label: '图文导航' },
        { value: '2', label: '文字导航' },
      ],
    },
  },
  {
    dataIndex: 'image_fill_style',
    title: '图片样式',
    valueType: 'VdRadioIcon',
    fieldProps: {
      options: [
        {
          text: '固定',
          value: '1',
          icon: 'deco-icon-fixed',
        },
        {
          text: '横向滑动',
          value: '2',
          icon: 'deco-icon-scroll',
        },
      ],
    },
  },
  {
    title: '一屏显示',
    dataIndex: 'count',
    valueType: 'VdSelect',
    fieldProps: {
      options: [
        {
          label: '4个导航',
          value: 4,
        },
        {
          label: '5个导航',
          value: 5,
        },
        {
          label: '6个导航',
          value: 6,
        },
        {
          label: '7个导航',
          value: 7,
        },
        {
          label: '8个导航',
          value: 8,
        },
        {
          label: '9个导航',
          value: 9,
        },
        {
          label: '10个导航',
          value: 10,
        },
      ],
    },
  },
  {
    ...color,
    dataIndex: 'background_color',
    title: '背景颜色',
    fieldProps: {
      defaultColor: '#fff',
    },
  },
  {
    ...color,
    dataIndex: 'color',
    title: '文字颜色',
    fieldProps: {
      defaultColor: '#000',
    },
  },
];

export default propsConfig;
