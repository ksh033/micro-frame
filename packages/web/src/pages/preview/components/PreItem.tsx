import React from 'react';
import classnames from 'classnames';
import './preItem.less';

type PreItemProps = {
  item: any;
  active: string | null;
  index: number;
  listLegth: number;
  setActive: (active: string, postMsg?: boolean) => void;
  onDelete: (dres: any, postMsg?: boolean) => void;
  arrayMove: (oldIndex: number, newIndex: number, postMsg?: boolean) => void;
  onCopy: (dres: any, postMsg?: boolean) => void;
};

const PreItem: React.FC<PreItemProps> = (props) => {
  const {
    item,
    active,
    setActive,
    arrayMove,
    index,
    listLegth,
    onDelete,
    onCopy,
  } = props;

  const onHandleClick = (it: any) => {
    setActive(it.id, true);
  };

  return (
    <div
      className={classnames({
        'pre-com-item': true,
        'drop-item': true,
        active: active == item.id,
      })}
      key={item.id}
      onClick={() => {
        onHandleClick(item);
      }}
    >
      <div>
        {item.cmpName}({item.cmpKey}): {JSON.stringify(item.values)}
      </div>
      <div className="pre-com-widget">
        <div className="widget-name tooltip">
          <p className="text-align">{item.cmpName}</p>
        </div>
      </div>
      {active == item.id ? (
        <div className="pre-com-operate">
          <div
            className="pre-com-operate-img"
            onClick={() => {
              if (index > 0) {
                arrayMove(index, index - 1, true);
              }
            }}
          >
            <img src="https://img01.yzcdn.cn/upload_files/2021/08/06/FimNddxSnHfWe4y9nRsX4U47sGys.png" />
          </div>
          <div
            className="pre-com-operate-img"
            onClick={() => {
              if (index + 1 <= listLegth) {
                arrayMove(index, index + 1, true);
              }
            }}
          >
            <img src="https://img01.yzcdn.cn/upload_files/2021/08/06/FsZTdbHdjP3f3CKqoV4JuK2CNisb.png" />
          </div>
          <div
            className="pre-com-operate-img"
            onClick={() => {
              onCopy(item, true);
            }}
          >
            <img src="https://img01.yzcdn.cn/upload_files/2021/08/06/FqPW2qX4rco6V8LV3vFzUL4OcEfa.png" />
          </div>
          <div
            className="pre-com-operate-img"
            onClick={() => {
              onDelete(item, true);
            }}
          >
            <img src="https://img01.yzcdn.cn/upload_files/2021/08/06/Fq479xofFePL9N7tqkua2YWGI8n0.png" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PreItem;
