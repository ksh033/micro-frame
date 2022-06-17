import { ClassType, CompsClassGroup, CompsGroup } from '../interface';
import Title from './title';
import NearbyShop from './NearbyShop';
import MagicCube from './MagicCube';
import PageInfo from './PageInfo';
import Goods from './Goods';

export { Title, NearbyShop, PageInfo };

const BaseCompClassGroup: CompsClassGroup[] = [
  {
    id: 'base-coms',
    name: '基础组件',
    list: [Title, NearbyShop, MagicCube, Goods],
  },
  {
    id: 'ump-coms',
    name: '营销组件',
    list: [],
  },
];

const BaseCompGroup: CompsGroup[] = BaseCompClassGroup.map(
  (it: CompsClassGroup) => {
    const list = it.list.map((purClass) => {
      return purClass.info;
    });
    return {
      id: it.id,
      name: it.name,
      list: list,
    };
  },
);

const BaseCompMap = new Map<String, ClassType>();
BaseCompClassGroup.forEach((it: CompsClassGroup) => {
  it.list.forEach((purClass) => {
    BaseCompMap.set(purClass.info.cmpKey, purClass);
  });
});

export { BaseCompMap, BaseCompGroup };
