import React from 'react';
// import { query } from './components/service';
import {getService} from '@/utils/api';
import type { PageConfig } from '@scboson/sc-schema';
import {useListPageContext,ListPage} from '@scboson/sc-schema'
import { PageContainer } from '@scboson/sc-layout';
import {BsSearch,BsTable} from '@micro-frame/sc-runtime';
import list from './components/list'


const { Operation } = BsTable;

const services=getService("deptUser","queryPage")
const pagaConfig: PageConfig = {
  path: '/user/',
  service:services,
  ...list,
};
const EmployManager: React.FC<any> = (props) => {
  // console.log("pageload")
  const page = useListPageContext();
  const search = page.getSearch({});
  const searchConfig = search
    .addSearchItem({ name: 'test', label: 'test', component: 'Input' })
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
    })   
    .toConfig();

  return (
    <PageContainer title={'用户管理'}>
      <BsSearch {...searchConfig}></BsSearch>
      <BsTable autoload={true} {...pageInfo}></BsTable>
    </PageContainer>
  );
};
export default ListPage(EmployManager, pagaConfig);
