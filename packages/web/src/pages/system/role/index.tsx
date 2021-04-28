import React from 'react'
import type { PageConfig } from '@scboson/sc-schema'
import { useListPageContext, ListPage, ToolButtons } from '@scboson/sc-schema'
import {
  BsSearch,
  BsTable,
  getService,
  PageContainer,
} from '@micro-frame/sc-runtime'
import list from './components/list'

const { Operation } = BsTable

const services = getService(
  'role',
  'queryPage',
  'remove',
  'disabled',
  'queryById',
  'listsys'
)
const pagaConfig: PageConfig = {
  path: '/system/role/',
  service: services,
  ...list,
}
const UserManager: React.FC<any> = (props) => {
  const page = useListPageContext()
  const search = page.getSearch({})
  const searchConfig = search.toConfig()

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
                roleId: _record.roleId,
                status: _record.enabled ? '0' : '1',
              },
            },
          },
          {
            ...ToolButtons.remove,
            options: {
              params: {
                roleId: _record.roleId,
              },
            },
          },
          {
            ...ToolButtons.edit,
            options: {
              pageProps: {
                roleId: _record.roleId,
              },
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
    .addButton('add', { options: { width: 800 } })
    .toConfig()
  return (
    <PageContainer title={'用户管理'}>
      <BsSearch {...searchConfig}></BsSearch>
      <BsTable autoload={true} {...pageInfo}></BsTable>
    </PageContainer>
  )
}
export default ListPage(UserManager, pagaConfig)
