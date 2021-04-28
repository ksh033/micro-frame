import React from 'react'
import { PageConfig, ToolButtons } from '@scboson/sc-schema'
import { useListPageContext, ListPage } from '@scboson/sc-schema'
import { CModal } from '@scboson/sc-element'
import {
  BsSearch,
  BsTable,
  getService,
  useServiceRequest,
  PageContainer,
} from '@micro-frame/sc-runtime'
import list from './components/list'
import EditPage from './editpage'

const { Operation } = BsTable

const services = getService(
  'deptUser',
  'queryPage',
  'disabled',
  'remove',
  'resetPassword'
)
const pagaConfig: PageConfig = {
  path: '/system/user/',
  service: services,
  ...list,
}
const UserManager: React.FC<any> = (props) => {
  const { run } = useServiceRequest('deptUser', 'resetPassword')
  const page = useListPageContext()
  const search = page.getSearch({})
  const searchConfig = search.toConfig()
  const callback = () => {
    page.reload()
  }

  const resetPassword = (userId: string) => {
    CModal.confirm({
      title: '您是否确定重置密码',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const data = await run({ userId: userId })
        return data
      },
      onCancel() {},
    })
  }

  const pageInfo = page
    .getTable()
    .addOpCol({
      render: (text: string, _record: any, index: number) => {
        const buttons: any[] = [
          {
            ...ToolButtons.disabled,
            text: _record.enabled ? '停用' : '启用',
            options: {
              params: {
                bizDeptUserId: _record.bizDeptUserId,
                status: _record.enabled ? '0' : '1',
              },
            },
          },
          {
            ...ToolButtons.remove,
            options: {
              params: {
                bizDeptUserId: _record.bizDeptUserId,
              },
            },
          },
          {
            ...ToolButtons.edit,
            options: {
              content: EditPage,
              width: 800,
              pageProps: {
                params: {
                  bizDeptUserId: _record.bizDeptUserId,
                },
              },
            },
          },
          {
            text: '重置密码',
            onClick: () => {
              resetPassword(_record.userId)
            },
          },
        ]
        const newButtons = page.bindEvents(buttons)

        return (
          <Operation
            key={index}
            max={5}
            record={_record}
            buttons={newButtons}
          />
        )
      },
    })
    .addButton('add', {
      options: {
        content: EditPage,
        width: 800,
        pageProps: { callBack: callback },
      },
    })
    .toConfig()
  return (
    <PageContainer title={'用户管理'}>
      <BsSearch {...searchConfig}></BsSearch>
      <BsTable autoload={true} {...pageInfo}></BsTable>
    </PageContainer>
  )
}
export default ListPage(UserManager, pagaConfig)
