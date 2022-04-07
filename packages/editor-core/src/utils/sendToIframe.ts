import { EditInfo } from '../stores/editor'

export const iframeId = 'myFrame'

export const postMessage = (type: string, data: any) => {
  const frameObj: any = document.getElementById('myFrame')

  if (frameObj && frameObj.contentWindow) {
    const msg = {
      type: type,
      data,
    }
    frameObj.contentWindow.postMessage(JSON.stringify(msg), '*')
  }
}

const addCmp = (item: EditInfo) => {
  postMessage('add', {
    cmpKey: item.cmpKey,
    values: item.values,
    id: item.id,
  })
}

const deleteCmp = (id: string) => {
  postMessage('delete', id)
}

const changeActiveCmp = (id: string) => {
  postMessage('changeActiveCmp', id)
}

const arrayMove = (oldIndex: number, newIndex: number) => {
  postMessage('arrayMove', {
    oldIndex: oldIndex,
    newIndex: newIndex,
  })
}

const updateCmp = (item: EditInfo) => {
  postMessage('update', {
    cmpKey: item.cmpKey,
    values: item.values,
    id: item.id,
  })
}

const clearAllCmp = () => {
  postMessage('clear', null)
}

export default {
  addCmp,
  deleteCmp,
  changeActiveCmp,
  arrayMove,
  updateCmp,
  clearAllCmp,
}
