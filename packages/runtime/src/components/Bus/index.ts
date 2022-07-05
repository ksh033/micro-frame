import PageSchema from '@scboson/sc-schema';
import Address from './Address';
import AreaSelect from './Address/AreaSelect';
import AreaSelectTree from './Address/AreaSelectTree';
import ChainManageComPanySelect from './ChainManageComPanySelect';
import CheckBoxDate from './CheckBoxDate';
import Enabled from './Enabled';
import ForEverDate from './ForEverDate';
import LocationAreaSelect from './LocationAreaSelect';
import LocationSearch from './LocationSearch';
import PageTitle from './PageTitle';
import RailMap from './RailMap';
import SelectCargo from './SelectCargo/index';
import CargoSelect from './SelectCargo/select';
import SelectCargoTable from './SelectCargo/table';
import SetCatalogRef from './SetCatalogRef';
import ShopTableSelect from './ShopTableSelect';
import SupplierTableSelect from './SupplierTableSelect';
import UserDept from './UserDept';

/**
 * 旧 商品组件
 *
 * @deprecated Begin
 */
import CatalogTreeSelect from './CatalogTreeSelect';
import GoodsCatalogSelect from './GoodsCatalog/GoodsCatalogSelect';
import OldGoodsCatalogTree from './GoodsCatalog/GoodsCatalogTree';
import ShowCatalogSelect from './ShowCatalog/ShowCatalogSelect';
import ShowCatalogTree from './ShowCatalog/ShowCatalogTree';
/** 旧 商品组件 end */
import BatchCopyAddModal from './BatchCopyAddModal';
import BrandSelect from './BrandSelect';
import CargoTableFooterSelect from './CargoTableFooterSelect';
import CooperateSupplierSelect from './CooperateSupplierSelect';
import Invalid from './Invalid';
import OrgSelect from './OrgSelect';
import PrintButton from './PrintButton';
import Quantity from './Quantity';
import UserInfo from './UserInfo';
import WarehouseTableSelect from './WarehouseTableSelect';

/** 新商品组件 */
import GoodsCatalogTree from './MallGoods/Catalog/CatalogTree';
import GoodsCatalogTreeSelect from './MallGoods/Catalog/CatalogTreeSelect';
import GoodsModalSelect from './MallGoods/Goods/GoodsCenterSelect';
import GoodsTable from './MallGoods/Goods/GoodsCenterTable';
import GoodsSelectTable from './MallGoods/Goods/GoodsSelectTable';
import PrintConfirm, { openPrintConfirm } from './PrintConfirm';
import PrintOptButton from './PrintOptButton';

const { regeditCmp } = PageSchema;
regeditCmp('CheckBoxDate', CheckBoxDate);
regeditCmp('Address', Address);
regeditCmp('ForEverDate', ForEverDate);
regeditCmp('AreaSelect', AreaSelect);
regeditCmp('AreaSelectTree', AreaSelectTree);
regeditCmp('Enabled', Enabled);
regeditCmp('LocationSearch', LocationSearch);
regeditCmp('RailMap', RailMap);
regeditCmp('CargoSelect', CargoSelect);
regeditCmp('SupplierTableSelect', SupplierTableSelect);
regeditCmp('ShopTableSelect', ShopTableSelect);
regeditCmp('UserDept', UserDept);
regeditCmp('LocationAreaSelect', LocationAreaSelect);
regeditCmp('GoodsCatalogSelect', GoodsCatalogSelect);

regeditCmp('GoodsCatalogSelect', GoodsCatalogTreeSelect);
regeditCmp('ShowCatalogSelect', ShowCatalogSelect);
regeditCmp('CooperateSupplierSelect', CooperateSupplierSelect);
regeditCmp('WarehouseTableSelect', WarehouseTableSelect);
regeditCmp('UserInfo', UserInfo);
regeditCmp('OrgSelect', OrgSelect);
regeditCmp('CatalogTreeSelect', CatalogTreeSelect);
regeditCmp('Quantity', Quantity);
regeditCmp('BrandSelect', BrandSelect);
regeditCmp('BatchCopyAddModal', BatchCopyAddModal);
regeditCmp('Invalid', Invalid);
regeditCmp('ChainManageComPanySelect', ChainManageComPanySelect);
regeditCmp('GoodsCatalogTreeSelect', GoodsCatalogTreeSelect);

export {
  CheckBoxDate,
  Address,
  ForEverDate,
  AreaSelect,
  AreaSelectTree,
  SelectCargo,
  SelectCargoTable,
  RailMap,
  LocationSearch,
  CargoSelect,
  SupplierTableSelect,
  ShopTableSelect,
  Enabled,
  PageTitle,
  UserDept,
  GoodsCatalogSelect,
  ShowCatalogTree,
  ShowCatalogSelect,
  OldGoodsCatalogTree,
  GoodsCatalogTree,
  PrintConfirm,
  openPrintConfirm,
  PrintButton,
  CatalogTreeSelect,
  GoodsSelectTable,
  WarehouseTableSelect,
  Quantity,
  BrandSelect,
  BatchCopyAddModal,
  OrgSelect,
  Invalid,
  CargoTableFooterSelect,
  GoodsModalSelect,
  GoodsTable,
  ChainManageComPanySelect,
  GoodsCatalogTreeSelect,
  SetCatalogRef,
  LocationAreaSelect,
  PrintOptButton,
};
