/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yangyuhang
 * @Date: 2023-03-03 15:33:21
 * @LastEditors: yangyuhang
 * @LastEditTime: 2023-03-07 18:01:24
 */

import { openWindow } from '../../Auth/';
import type { FormComponent, FormComponentProps } from '@scboson/sc-element/es/c-form';
import { Timeline, Space } from 'antd';
import BsUpload from '../../Base/BsUpload';

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
                  <span>{it.operateTime}</span>
                  <span>{it.operatorName}</span>
                  <span>{it.operationContent || ''}</span>
                </Space>
                {
                  Array.isArray(it.fileVOS) && it.fileVOS && <Space direction='vertical'>
                    <span>操作凭证:</span>
                    <BsUpload
                      mode={'multiple'}
                      value={it.fileVOS.map((item: any) => {
                        return { url: item.url, fileName: item.title }
                      })}
                      readonly
                    />
                  </Space>
                }

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
