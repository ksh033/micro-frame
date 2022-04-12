import React from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import ComItem from './ComItem';
import { observer } from 'mobx-react-lite';
// @ts-ignore
import { CompsGroup } from '@scvisual/element';
import { useStore } from '../../stores';

const ComsPanel: React.FC<any> = (props) => {
  const { comsStore, editorStore } = useStore();

  const comsList = comsStore.comsList;

  const handleClick = (event: any, cmpKey: string) => {
    const item = comsStore.getCompByKey(cmpKey);
    if (item) {
      const flag = comsStore.addComsNum(cmpKey);
      if (flag) {
        editorStore.addToEdit(item);
      }
    }
  };

  const comsTabs = (tab: CompsGroup) => {
    const { name, id, list } = tab;

    return (
      <div className="coms-lib" key={id}>
        <div className="coms-lib-tab">
          <CaretDownOutlined className="coms-lib-tab-icon"></CaretDownOutlined>
          <span className="coms-lib-tab-name">{name}</span>
        </div>
        <div className="com-list">
          {list.map((com: any) => {
            return (
              <ComItem
                item={com}
                key={com.cmpKey}
                onClick={handleClick}
                regeditCmpName={com.cmpKey}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="left-wrapper">
      <div className="coms-lib-wrap">
        <div className="coms-lib">
          <div className="com-list" id="drag-box">
            {comsList.map((item) => {
              return comsTabs(item);
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default observer(ComsPanel);
