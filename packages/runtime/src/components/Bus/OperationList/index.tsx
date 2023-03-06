/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yangyuhang
 * @Date: 2023-03-03 15:33:21
 * @LastEditors: yangyuhang
 * @LastEditTime: 2023-03-03 17:36:59
 */

import { openWindow } from '../../Auth/';
import type { FormComponent, FormComponentProps } from '@scboson/sc-element/es/c-form';
import { Timeline, Space } from 'antd';

type OperationListProps = FormComponentProps & {
  value: any[];
};
const OperationList: FormComponent<OperationListProps> = (pros) => {
  const { value = [] } = pros;

  return (
    <Timeline>
      {Array.isArray(value)
        ? value.map((it: any, index: number) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Timeline.Item key={`line-${index}`}>
              <Space direction='vertical'>
                <Space>
                  <span>{it.createTime}</span>
                  <span>{it.operatorName}</span>
                  <span>{it.operationContent || ''}</span>
                </Space>
                <Space>
                  {it.fileVOS && <span>操作凭证:</span>}
                  {it.fileVOS?.map((item: any) => {
                    return <span><a href={'/' + item.url}>{item.title}</a></span>
                  })}
                </Space>
              </Space>
            </Timeline.Item>
          );
        })
        : null}
    </Timeline>
  );
};

OperationList.customView = true;

export default OperationList;
