import { observable, action } from 'mobx'
import { ClassType, ComponentSchemaProps } from '@scvisual/element'
import { BaseCompMap } from '@scvisual/element'
import { arrayMoveImmutable } from 'array-move'
import sendToIframe from '../../utils/sendToIframe'
import { PageInfo } from '@scvisual/element'

export type ModalType = 'component' | 'componentList' | 'pageSet'

export type editorStoreType = {
  modalType: ModalType // 右侧模板类型
  pageinfo: ComponentSchemaProps | null
  currentKey: string | null // 正在编辑的组件id
  currentEditCmp: ComponentSchemaProps | null // 正在编辑的数据
  editList: ComponentSchemaProps[] // 所有的编辑列表
  updateCurrentEditCmpValues: (newValues: any) => void // 更新正在编辑的组件的内容
  switchEditCmp: (id: string) => void // 切换编辑的组件
  addToEdit: (item: ClassType) => void // 添加组件
  deleteCmp: (id: string) => void // 删除组件
  copyCmp: (record: ComponentSchemaProps) => void // 拷贝组件
  clearAllCmp: () => void // 清除全部编辑组件
  updeteEditList: () => void // 更新编辑列表
  updeteEditListItem: (record: ComponentSchemaProps) => void
  sortEditList: (oldIndex: number, newIndex: number) => void // 更新排序
  changeModalType: (type: ModalType) => void // 切换状态
  updatePageInfoValues: (newValues: any) => void // 更新页面设置数据
}

class EditorClass {
  @observable modalType: ModalType = 'pageSet'
  @observable pageinfo = new PageInfo()
  @observable currentKey: string | null = null
  @observable currentEditCmp: ComponentSchemaProps | null = null
  @observable editList: ComponentSchemaProps[] = []

  // 切换状态
  @action.bound
  changeModalType(type: ModalType) {
    if (type === 'componentList') {
      this.currentEditCmp = null
      this.currentKey = null
    }
    this.modalType = type
  }

  // 更新正在编辑的组件的内容
  @action.bound
  updateCurrentEditCmpValues(newValues: any) {
    if (this.currentEditCmp) {
      this.currentEditCmp.setFieldsValue(newValues)
      // 发送消息给iframe
      sendToIframe.updateCmp(this.currentEditCmp)
    }
  }

  // 更新页面设置数据
  @action.bound
  updatePageInfoValues(newValues: any) {
    this.pageinfo.values = newValues
  }

  // 添加组件
  @action.bound
  addToEdit(item: ClassType): void {
    // 先更新当前的 list 下的数据
    this.updeteEditList()
    const newItem = new item()
    if (newItem.getInitialValue) {
      newItem.setFieldsValue(newItem.getInitialValue())
    }

    this.currentEditCmp = newItem
    this.currentKey = newItem.id
    this.modalType = 'component'
    this.editList.push(newItem)
    // 发送消息给iframe
    sendToIframe.addCmp(newItem)
  }

  // 删除组件
  @action.bound
  deleteCmp(id: string) {
    const index = this.editList.findIndex((it) => it.id === id)
    if (index !== -1) {
      console.log(12312)
      this.editList.splice(index, 1)
    }
    if (this.currentKey === id) {
      this.currentKey = null
      this.currentEditCmp = null
    }
    // 发送消息给iframe
    sendToIframe.deleteCmp(id)
  }

  // 复制组件
  @action.bound
  copyCmp(record: ComponentSchemaProps) {
    const cmpKey = record.cmpKey
    const Clas = BaseCompMap.get(cmpKey)
    if (Clas) {
      const newItem = new Clas()
      newItem.setFieldsValue(record.values)
      this.editList = this.editList.concat([newItem])
      // 发送消息给iframe
      sendToIframe.addCmp(newItem)
    }
  }

  // 清空组件
  @action.bound
  clearAllCmp() {
    this.editList = []
    this.currentKey = null
    this.currentEditCmp = null

    // 发送消息给iframe
    sendToIframe.clearAllCmp()
  }

  // 切换编辑的组件
  @action.bound
  switchEditCmp(id: string): void {
    // 先更新当前的 list 下的数据
    this.updeteEditList()

    const item = this.editList.find((it) => it.id === id)
    if (item) {
      this.currentKey = id
      const Clas = BaseCompMap.get(item.cmpKey)
      if (Clas) {
        const newItem = new Clas()
        newItem.initClass(item)
        this.currentEditCmp = newItem
        this.modalType = 'component'
      }
    }

    // 发送消息给iframe
    sendToIframe.changeActiveCmp(id)
  }

  // 把当前数据更新进编辑列表
  @action.bound
  updeteEditList() {
    if (this.currentEditCmp && this.currentKey) {
      const editCmp = JSON.parse(JSON.stringify(this.currentEditCmp))
      const index = this.editList.findIndex((it) => it.id === editCmp?.id)
      if (index !== -1) {
        this.editList.splice(index, 1, editCmp)
      }
      this.currentEditCmp = null
      this.currentKey = null
    }
  }

  // 更新编辑列表
  @action.bound
  updeteEditListItem(record: ComponentSchemaProps) {
    if (record) {
      const editCmp = JSON.parse(JSON.stringify(record))
      const index = this.editList.findIndex((it) => it.id === editCmp?.id)
      if (index !== -1) {
        this.editList.splice(index, 1, editCmp)
      }
    }
  }

  // 更新排序
  @action.bound
  sortEditList(oldIndex: number, newIndex: number) {
    this.editList = arrayMoveImmutable(this.editList, oldIndex, newIndex)

    // 发送消息给iframe
    sendToIframe.arrayMove(oldIndex, newIndex)
  }
}
const editorStore: editorStoreType = new EditorClass()
export default editorStore
