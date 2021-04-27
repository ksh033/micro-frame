import React from 'react'
import { PageConfig, ToolButtons } from '@scboson/sc-schema'
import { useListPageContext, ListPage } from '@scboson/sc-schema'
import {
  BsSearch,
  BsTable,
  getService,
  PageContainer,
} from '@micro-frame/sc-runtime'
import list from './components/list'
import EditPage from './editpage'

const { Operation } = BsTable

const services = getService('deptUser', 'queryPage', 'disabled', 'remove')
const pagaConfig: PageConfig = {
  path: '/system/user/',
  service: services,
  ...list,
}
const UserManager: React.FC<any> = (props) => {
  // console.log("pageload")
  const page = useListPageContext()
  const search = page.getSearch({})
  const searchConfig = search.toConfig()
  const callback = () => {
    page.reload()
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
              callBack: callback,
              params: {
                bizDeptUserId: _record.bizDeptUserId,
                status: _record.enabled ? '0' : '1',
              },
            },
          },
          {
            ...ToolButtons.remove,
            options: {
              callBack: callback,
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
