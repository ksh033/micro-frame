/* eslint-disable react-hooks/rules-of-hooks */
import { useEventListener, useSafeState } from 'ahooks';
import React from 'react';
import { arrayMoveImmutable } from 'array-move';
// import { useStore } from '@/store';
import './index.less';
import PreItem from './components/PreItem';
import postMegToParent from './postMegToParent';

const iframe: React.FC<any> = () => {
  const [list, setList] = useSafeState([]);
  const [active, setActive] = useSafeState<string | null>(null);

  const onSetActive = (id: string, postMsg: boolean = false) => {
    if (id != null) {
      setActive(id);
      if (postMsg) {
        postMegToParent.changeActiveCmp(id);
      }
    }
  };

  const arrayMove = (
    oldIndex: number,
    newIndex: number,
    postMsg: boolean = false
  ) => {
    let newList = JSON.parse(JSON.stringify(list));
    newList = arrayMoveImmutable(list, oldIndex, newIndex);
    setList(newList);
    if (postMsg) {
      postMegToParent.arrayMove(oldIndex, newIndex);
    }
  };

  const add = (index: number, dres: any) => {
    const newList = JSON.parse(JSON.stringify(list));
    if (index >= list.length) {
      newList.push(dres);
    } else {
      newList.splice(index, 0, dres);
    }
    setActive(dres.id);
    setList(newList);
  };

  const update = (dres: any) => {
    const newList = JSON.parse(JSON.stringify(list));
    const index = newList.findIndex((it: any) => it.id === dres.id);
    if (index > -1) {
      newList.splice(index, 1, dres);
    }
    setList(newList);
  };

  const clear = () => {
    setList([]);
  };

  const onCopy = (dres: any, postMsg: boolean = false) => {
    const newList = JSON.parse(JSON.stringify(list));
    const index = newList.findIndex((it: any) => it.id === dres.id);
    if (index > -1) {
      const newData = dres;
      newData.id = postMegToParent.genNonDuplicateId();
      newData.index = index + 1;
      newList.splice(index, 0, newData);
      setList(newList);
      if (postMsg) {
        postMegToParent.copyCmp(newData);
      }
    }
  };

  const onDelete = (dres: any, postMsg: boolean = false) => {
    let newList = JSON.parse(JSON.stringify(list));
    newList = newList.filter((it: any) => it.id !== dres.id);
    setList(newList);
    if (postMsg) {
      postMegToParent.deleteCmp(dres);
    }
  };

  useEventListener('message', (event: any) => {
    let data: any = null;
    if (typeof event.data === 'string') {
      data = JSON.parse(event.data);
      console.log('data', data);
      const dres = data.data;
      if (data.type === 'add') {
        add(data.index, dres);
      }
      if (data.type === 'delete') {
        onDelete(dres);
      }
      if (data.type === 'clear') {
        clear();
      }
      if (data.type === 'update') {
        update(dres);
      }

      if (data.type === 'arrayMove') {
        arrayMove(dres.oldIndex, dres.newIndex);
      }
    }
  });

  return (
    <div className="vd-preview">
      <div className="vd-preview-head">
        <div className="vd-preview-header-title">微页面标题</div>
      </div>
      <div className="vd-preview-content" id="drop-box">
        {list.map((item: any, index) => (
          <PreItem
            index={index}
            item={item}
            listLegth={list.length}
            active={active}
            setActive={onSetActive}
            key={item.id}
            onDelete={onDelete}
            arrayMove={arrayMove}
            onCopy={onCopy}
          />
        ))}
      </div>
      <div className="vd-preview-footer">
        <div>博耕科技支持</div>
      </div>
    </div>
  );
};
export default iframe;
