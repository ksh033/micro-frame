// @ts-ignore
import type { ComponentSchemaProps } from '@scvisual/element';
// @ts-ignore
import { BaseCompMap, ClassType, PageInfo } from '@scvisual/element';
import { arrayMoveImmutable } from 'array-move';
import cloneDeep from 'lodash/cloneDeep';
import { action, observable } from 'mobx';
import { genNonDuplicateId } from '../../utils/common';
import sendToIframe from '../../utils/sendToIframe';

export type ModalType = 'component' | 'componentList' | 'pageSet';

export type editorStoreType = {
  modalType: ModalType; // 右侧模板类型
  pageinfo: ComponentSchemaProps | null;
  currentKey: string | null; // 正在编辑的组件id
  currentEditCmp: ComponentSchemaProps | null; // 正在编辑的数据
  editList: ComponentSchemaProps[]; // 所有的编辑列表
  updateCurrentEditCmpValues: (newValues: any) => void; // 更新正在编辑的组件的内容
  switchEditCmp: (id: string, immediatelyCheck?: boolean) => void; // 切换编辑的组件
  addToEdit: (item: ClassType, index?: number, noticed?: boolean) => void; // 添加组件并编辑
  addCmp: (record: ComponentSchemaProps, index: number) => void; // 纯粹添加组件
  deleteCmp: (id: string, noticed?: boolean) => void; // 删除组件
  copyCmp: (record: ComponentSchemaProps, noticed?: boolean) => void; // 拷贝组件
  clearAllCmp: () => void; // 清除全部编辑组件
  updeteEditList: () => void; // 更新编辑列表
  updeteEditListItem: (record: ComponentSchemaProps) => void;
  arrayMove: (oldIndex: number, newIndex: number, noticed?: boolean) => void; // 更新排序
  changeModalType: (type: ModalType) => void; // 切换状态
  updatePageInfoValues: (newValues: any) => void; // 更新页面设置数据
};

class EditorClass {
  @observable modalType: ModalType = 'pageSet';
  @observable pageinfo = new PageInfo();
  @observable currentKey: string | null = null;
  @observable currentEditCmp: ComponentSchemaProps | null = null;
  @observable editList: ComponentSchemaProps[] = [];

  // 切换状态
  @action.bound
  changeModalType(type: ModalType) {
    if (type === 'componentList') {
      this.currentEditCmp = null;
      this.currentKey = null;
    }
    this.modalType = type;
  }

  // 更新正在编辑的组件的内容
  @action.bound
  updateCurrentEditCmpValues(newValues: any) {
    if (this.currentEditCmp) {
      this.currentEditCmp.setFieldsValue(newValues);
      // 发送消息给iframe
      sendToIframe.updateCmp(this.currentEditCmp);
    }
  }

  // 更新页面设置数据
  @action.bound
  updatePageInfoValues(newValues: any) {
    this.pageinfo.values = newValues;
  }

  // 添加组件并修改
  @action.bound
  addToEdit(item: ClassType, index?: number, noticed = true): void {
    // 先更新当前的 list 下的数据
    // this.updeteEditList();
    const newItem = new item();

    if (newItem.setId) {
      newItem.setId(genNonDuplicateId());
    }
    if (newItem.getInitialValue) {
      console.log('newItem.getInitialValue()', newItem.getInitialValue());
      newItem.setFieldsValue(newItem.getInitialValue());
    }
    console.log('addToEdit', newItem);
    this.currentEditCmp = newItem;
    this.currentKey = newItem.id;
    this.modalType = 'component';
    if (index != null) {
      this.editList.splice(index, 0, newItem);
    } else {
      this.editList.push(newItem);
    }
    if (noticed) {
      // 发送消息给iframe
      sendToIframe.addCmp(newItem, index);
    }
  }
  // 添加组件
  @action.bound
  addCmp(item: ComponentSchemaProps, index: number) {
    if (index != null && index > -1) {
      this.editList.splice(index, 0, item);
    }
  }

  // 删除组件
  @action.bound
  deleteCmp(id: string, noticed = true) {
    this.editList = this.editList.filter((it) => it.id !== id);
    if (this.currentKey === id) {
      this.currentKey = null;
      this.currentEditCmp = null;
    }
    if (noticed) {
      // 发送消息给iframe
      sendToIframe.deleteCmp(id);
    }
  }

  // 复制组件
  @action.bound
  copyCmp(record: ComponentSchemaProps, noticed = true) {
    const cmpKey = record.cmpKey;
    const Clas = BaseCompMap.get(cmpKey);
    if (Clas) {
      const newItem = new Clas();
      console.log('copyCmp');
      newItem.setFieldsValue(record.values);
      const index = this.editList.findIndex((it) => it.id === record.id);
      if (index > -1) {
        const newIndex = index + 1;
        this.editList.splice(newIndex, 0, newItem);

        if (noticed) {
          // 发送消息给iframe
          sendToIframe.copyCmp(newItem, newIndex);
        }
      }
    }
  }

  // 清空组件
  @action.bound
  clearAllCmp() {
    this.editList = [];
    this.currentKey = null;
    this.currentEditCmp = null;

    // 发送消息给iframe
    sendToIframe.clearAllCmp();
  }

  // 切换编辑的组件
  @action.bound
  switchEditCmp(id: string, immediatelyCheck: boolean = false): void {
    // 先更新当前的 list 下的数据
    this.updeteEditList();

    const item = this.editList.find((it) => it.id === id);
    if (item) {
      this.currentKey = id;
      const Clas = BaseCompMap.get(item.cmpKey);
      if (Clas) {
        const newItem = new Clas();
        newItem.initClass({
          ...item,
          immediatelyCheck: immediatelyCheck,
        });
        this.currentEditCmp = newItem;
        this.modalType = 'component';
      }
    }
  }

  // 把当前数据更新进编辑列表
  @action.bound
  updeteEditList() {
    if (this.currentEditCmp && this.currentKey) {
      const editCmp = cloneDeep(this.currentEditCmp);
      const index = this.editList.findIndex((it) => it.id === editCmp?.id);
      if (index !== -1) {
        this.editList.splice(index, 1, editCmp);
      }
      this.currentEditCmp = null;
      this.currentKey = null;
    }
  }

  // 更新编辑列表
  @action.bound
  updeteEditListItem(record: ComponentSchemaProps) {
    if (record) {
      const editCmp = cloneDeep(record);
      const index = this.editList.findIndex((it) => it.id === record?.id);
      if (index !== -1) {
        this.editList.splice(index, 1, editCmp);
      }
    }
  }

  // 更新排序
  @action.bound
  arrayMove(oldIndex: number, newIndex: number, noticed = true) {
    if (oldIndex !== newIndex) {
      this.editList = arrayMoveImmutable(this.editList, oldIndex, newIndex);
    }
    if (noticed) {
      // 发送消息给iframe
      sendToIframe.arrayMove(oldIndex, newIndex);
    }
  }
}
const editorStore: editorStoreType = new EditorClass();
export default editorStore;
