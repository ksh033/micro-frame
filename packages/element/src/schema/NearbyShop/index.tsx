import { VdProFormColumnsType } from '../../interface'
import ParentSchemCmp from '../../base/ParentSchemCmp'

class NearbyShop extends ParentSchemCmp {
  cmpKey: string = 'NearbyShop'
  cmpName: string = '附近的门店'
  propsConfig: VdProFormColumnsType[] = [
    {
      title: '分组',
      valueType: 'group',
      columns: [
        {
          title: '状态',
          dataIndex: 'groupState',
        },
        {
          title: '标题',
          dataIndex: 'groupTitle',
        },
      ],
    },
  ]
}

NearbyShop.info = {
  icon: 'https://img.yzcdn.cn/public_files/e93ff32ae14f629f9b8c064fff63b23f.png',
  name: '附近的门店',
  cmpKey: 'NearbyShop',
  description:
    '该组件当前仅支持微信小程序（需要体验版v3.51.1版本及以上），预览或在其他渠道打开，该组件将不可见；未配置店铺情况下，该组件不可见。',
  maxNum: 1,
  usedNum: 0,
  status: '',
}

export default NearbyShop
