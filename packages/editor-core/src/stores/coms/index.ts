import { observable, action } from 'mobx';
// @ts-ignore
import { BaseCompGroup, BaseCompMap, CmpInfo } from '@scvisual/element';
// @ts-ignore
import type { ClassType, CompsGroup } from '@scvisual/element';
import { message } from 'antd';

export type comsStoreType = {
  comsList: CompsGroup[]; // 组件列表
  comsMap: Map<String, ClassType>; // 组件map
  comsInfoMap: Map<String, CmpInfo>; // 组件map
  getCompByKey: (key: string) => ClassType | null; // 通过组件key获取组件
  getCompInfoByKey: (key: string) => CmpInfo | undefined; // 通过组件key获取组件
  initComsInfoMap: () => void; // 初始化组件
  updateList: (cmpKey: string, num: number) => void; // 更新list的数据
  addComsNum: (cmpKey: string) => boolean; // 添加组件数量
  minusComsNum: (cmpKey: string) => boolean; // 减组件数量
  clearNum: () => void; // 清空数量
};

class ComsClass {
  @observable comsList = BaseCompGroup;
  @observable comsMap = BaseCompMap;
  @observable comsInfoMap = new Map<String, CmpInfo>();

  /**
   * 初始化组件
   */
  constructor() {
    this.initComsInfoMap();
  }

  @action.bound
  initComsInfoMap() {
    const map = new Map<String, CmpInfo>();
    this.comsList.forEach((it: CompsGroup) => {
      if (Array.isArray(it.list)) {
        it.list.forEach((itm: CmpInfo) => {
          map.set(itm.cmpKey, itm);
        });
      }
    });
    this.comsInfoMap = map;
  }

  // 通过组件key获取组件
  @action.bound
  getCompByKey(key: string): ClassType | null {
    const clas: any = this.comsMap.get(key);
    return clas || null;
  }

  // 通过组件key获取组件
  @action.bound
  getCompInfoByKey(key: string): CmpInfo | undefined {
    return this.comsInfoMap.get(key);
  }

  @action.bound
  updateList(cmpKey: string, num: number) {
    this.comsList.forEach((item: CompsGroup) => {
      item.list.forEach((it: CmpInfo) => {
        if (it.cmpKey === cmpKey && it) {
          it.usedNum = num;
        }
      });
    });
  }
  // 添加组件数量
  @action.bound
  addComsNum(cmpKey: string) {
    const itemCom = this.getCompInfoByKey(cmpKey);
    if (itemCom) {
      const newItem = itemCom;
      const usedNum = newItem.usedNum || 0;
      const maxNum = newItem.maxNum || 100000;
      const num = usedNum + 1;
      if (num <= maxNum) {
        newItem.usedNum = num;
        this.comsInfoMap.set(cmpKey, newItem);
        this.updateList(cmpKey, num);
        return true;
      } else {
        message.warning('该组件已添加至上限');
        return false;
      }
    } else {
      console.warn('未找到 '.concat(cmpKey, ' 对应的组件模块'), cmpKey);
      return false;
    }
  }
  // 减组件数量
  @action.bound
  minusComsNum(cmpKey: string) {
    const itemCom = this.getCompInfoByKey(cmpKey);
    if (itemCom) {
      const newItem = itemCom;
      const usedNum = newItem.usedNum || 0;
      const num = usedNum - 1;
      if (num >= 0) {
        newItem.usedNum = num;
        this.comsInfoMap.set(cmpKey, newItem);
        this.updateList(cmpKey, num);
        return true;
      }
      return false;
    } else {
      console.warn('未找到 '.concat(cmpKey, ' 对应的组件模块'), cmpKey);
      return false;
    }
  }
  // 清空数量
  clearNum() {
    this.comsList = this.comsList.map((item: CompsGroup) => {
      item.list = item.list.map((it: CmpInfo) => {
        if (it) {
          it.usedNum = 0;
        }
        return it;
      });
      return item;
    });
    this.initComsInfoMap();
  }
}
const comsStore: comsStoreType = new ComsClass();
export default comsStore;
