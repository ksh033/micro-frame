import { Tabs } from 'antd';
import React from 'react';

const TabsForm: React.FC<any> = (props: any) => {
  const { options = [], onChange, value } = props;
  const { TabPane } = Tabs;
  return (
    <div style={{ marginTop: '-12px' }}>
      <Tabs centered onChange={onChange} activeKey={value}>
        {options.map((it: any) => {
          return <TabPane tab={it.text} key={it.value}></TabPane>;
        })}
      </Tabs>
    </div>
  );
};

export default TabsForm;
