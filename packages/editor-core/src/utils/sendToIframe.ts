// @ts-ignore
import { ComponentSchemaProps } from '@scvisual/element';
import { iframeId } from '../index';

export const postMessage = (type: string, data: any, index?: number) => {
  const frameObj = document.getElementById(iframeId) as HTMLIFrameElement;
  let addIndex = index;
  if (index == null) {
    const doc = frameObj.contentDocument;
    if (doc) {
      const dropEle = doc?.getElementById('drop-box');
      const dropEleChild = [];
      if (dropEle) {
        dropEle.childNodes.forEach((item) => {
          if (item.nodeType === 1) {
            dropEleChild.push(item);
          }
        });
      }
      addIndex = dropEleChild.length;
    }
  }
  if (frameObj && frameObj.contentWindow) {
    const msg = {
      type: type,
      data,
      index: addIndex,
    };
    frameObj.contentWindow.postMessage(JSON.stringify(msg), '*');
  }
};

const addCmp = (item: ComponentSchemaProps, index?: number) => {
  postMessage(
    'add',
    {
      cmpKey: item.cmpKey,
      cmpName: item.cmpName,
      values: item.values,
      id: item.id,
    },
    index,
  );
};

const deleteCmp = (id: string) => {
  postMessage('delete', id);
};

const changeActiveCmp = (id: string) => {
  postMessage('changeActiveCmp', id);
};

const arrayMove = (oldIndex: number, newIndex: number) => {
  postMessage('arrayMove', {
    oldIndex: oldIndex,
    newIndex: newIndex,
  });
};

const updateCmp = (item: ComponentSchemaProps) => {
  postMessage('update', {
    cmpKey: item.cmpKey,
    cmpName: item.cmpName,
    values: item.values,
    id: item.id,
  });
};

const copyCmp = (item: ComponentSchemaProps, index: number) => {
  postMessage(
    'copy',
    {
      cmpKey: item.cmpKey,
      cmpName: item.cmpName,
      values: item.values,
      id: item.id,
    },
    index,
  );
};

const clearAllCmp = () => {
  postMessage('clear', null);
};

export default {
  addCmp,
  deleteCmp,
  copyCmp,
  changeActiveCmp,
  arrayMove,
  updateCmp,
  clearAllCmp,
};
