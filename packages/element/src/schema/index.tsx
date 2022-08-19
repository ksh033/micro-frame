import { ClassType, CompsClassGroup, CompsGroup } from '../interface';
import Title from './Title';
import MagicCube from './MagicCube';
import PageInfo from './PageInfo';
import Goods from './Goods';
import AdImage from './AdImage';
import ElevatorNav from './ElevatorNav';
import CrowdImage from './CrowdImage';
import ImageTextNav from './ImageTextNav';
import White from './White';
import Search from './Search';
import Store from './Store';
import Notice from './Notice';
import Video from './VideoCmp';
import Coupon from './Coupon';

export { Title, PageInfo };

const BaseCompClassGroup: CompsClassGroup[] = [
  {
    id: 'base-coms',
    name: '基础组件',
    list: [
      Title,
      ElevatorNav,
      Goods,
      CrowdImage,
      AdImage,
      ImageTextNav,
      MagicCube,
      White,
      Search,
      Store,
      Notice,
      Video,
      // NearbyShop,
    ],
  },
  {
    id: 'ump-coms',
    name: '营销组件',
    list: [Coupon],
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
