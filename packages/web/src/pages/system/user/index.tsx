import React from 'react';
// import { query } from './components/service';
import {getService} from '@/utils/api';
import type { PageConfig } from '@scboson/sc-schema';
import {useListPageContext,ListPage} from '@scboson/sc-schema'
import {BsSearch,BsTable,PageContainer} from '@micro-frame/sc-runtime';
import list from './components/list'
import EditPage from './editpage'

const { Operation } = BsTable;

const services=getService("deptUser","queryPage")
const pagaConfig: PageConfig = {
  path: '/system/user/',
  service:services,
  ...list,
};
const UserManager: React.FC<any> = (props) => {
  // console.log("pageload")
  const page = useListPageContext();
  const search = page.getSearch({});
  const searchConfig = search
    .toConfig();
  const pageInfo = page
    .getTable()
    .addOpCol({
      render: (text: string, _record: any, index: number) => {
        const buttons: any[] = [
          {
            options: {
              pageProps: {
                action: 'view',
                record: _record.storageInOrderId,
              },
            },
          },
        ];
        const newButtons = page.bindEvents(buttons);

        return <Operation key={index} max={5} record={_record} buttons={newButtons} />;
      },
    }).addButton('add', { options: { content: EditPage, width: 800 } })  
    .toConfig();

  return (
    <PageContainer title={'用户管理'}>
      <BsSearch {...searchConfig}></BsSearch>
      <BsTable autoload={true} {...pageInfo}></BsTable>
    </PageContainer>
  );
};
export default ListPage(UserManager, pagaConfig);
