import { VdProFormColumnsType } from '../../interface'
import ParentSchemCmp from '../../base/ParentSchemCmp'

class PageInfo extends ParentSchemCmp {
  cmpName = '页面设置'
  id = 'page-setting'
  cmpKey: string = 'PAGE-SETTING'
  propsConfig: VdProFormColumnsType<any>[] = [
    {
      title: '页面名称',
      dataIndex: 'pageName',
    },
    {
      title: '页面描述',
      dataIndex: 'pageDesc',
      fieldProps: {
        placeholder: '用户通过微信分享给朋友时，会自动显示页面描述',
      },
    },
  ]
}

export default PageInfo
