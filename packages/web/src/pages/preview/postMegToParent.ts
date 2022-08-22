function genNonDuplicateId(randomLength: number | undefined = 10) {
  let idStr = Date.now().toString(36);
  idStr += Math.random().toString(36).substr(3, randomLength);
  return idStr;
}
export const postMessage = (type: string, data: any) => {
  const parent = window.parent;
  if (parent) {
    const msg = {
      type: type,
      data,
    };
    parent.postMessage(JSON.stringify(msg), '*');
  }
};

const deleteCmp = (item: any) => {
  postMessage('delete', item);
};

const changeActiveCmp = (id: string) => {
  postMessage('changeActive', id);
};

const arrayMove = (oldIndex: number, newIndex: number) => {
  postMessage('arrayMove', {
    oldIndex: oldIndex,
    newIndex: newIndex,
  });
};

const copyCmp = (item: any) => {
  postMessage('copy', {
    index: item.index,
    cmpKey: item.cmpKey,
    cmpName: item.cmpName,
    values: item.values,
    id: item.id,
  });
};

export default {
  deleteCmp,
  copyCmp,
  changeActiveCmp,
  arrayMove,
  genNonDuplicateId,
};
