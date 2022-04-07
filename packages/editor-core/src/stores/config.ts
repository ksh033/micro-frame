/*
 * @Author: your name
 * @Date: 2020-09-16 18:53:26
 * @LastEditTime: 2020-09-17 11:10:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-cli\src\stores\config.ts
 */
import comsStore from './coms/index'
import editorStore from './editor/index'
import previewStore from './preview/index'

export function createStore() {
  return {
    comsStore,
    editorStore,
    previewStore,
  }
}

export const store = createStore()

export type TStore = ReturnType<typeof createStore>
