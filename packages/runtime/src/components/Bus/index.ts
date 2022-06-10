import PageSchema from '@scboson/sc-schema';
import CheckBoxDate from './CheckBoxDate';
import Address from './Address';
import ForEverDate from './ForEverDate';
import AreaSelect from './Address/AreaSelect';
import AreaSelectTree from './Address/AreaSelectTree';
import SelectCargoTable from './SelectCargo/table';
import SelectCargo from './SelectCargo/index';
import CargoSelect from './SelectCargo/select';
import Enabled from './Enabled';
import LocationSearch from './LocationSearch';
import SupplierTableSelect from './SupplierTableSelect';
import ShopTableSelect from './ShopTableSelect';
import RailMap from './RailMap';
import PageTitle from './PageTitle';
import UserDept from './UserDept';
import ChainManageComPanySelect from './ChainManageComPanySelect';

/**
 * 旧 商品组件
 *
 * @deprecated Begin
 */
import GoodsCatalogSelect from './GoodsCatalog/GoodsCatalogSelect';
import OldGoodsCatalogTree from './GoodsCatalog/GoodsCatalogTree';
import ShowCatalogSelect from './ShowCatalog/ShowCatalogSelect';
import ShowCatalogTree from './ShowCatalog/ShowCatalogTree';
import CatalogTreeSelect from './CatalogTreeSelect';
/** 旧 商品组件 end */
import CooperateSupplierSelect from './CooperateSupplierSelect';
import PrintButton from './PrintButton';
import WarehouseTableSelect from './WarehouseTableSelect';
import UserInfo from './UserInfo';
import OrgSelect from './OrgSelect';
import Quantity from './Quantity';
import BrandSelect from './BrandSelect';
import BatchCopyAddModal from './BatchCopyAddModal';
import Invalid from './Invalid';
import CargoTableFooterSelect from './CargoTableFooterSelect';

/** 新商品组件 */
import GoodsCatalogTree from './MallGoods/Catalog/CatalogTree';
import GoodsTable from './MallGoods/Goods/GoodsCenterTable';
import GoodsModalSelect from './MallGoods/Goods/GoodsCenterSelect';
import GoodsSelectTable from './MallGoods/Goods/GoodsSelectTable';
import GoodsCatalogTreeSelect from './MallGoods/Catalog/CatalogTreeSelect';
import PrintConfirm, { openPrintConfirm } from './PrintConfirm';

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
};
