import PageSchema from '@scboson/sc-schema'
import CheckBoxDate from './CheckBoxDate'
import Address from './Address'
import ForEverDate from './ForEverDate'
import AreaSelect from './Address/AreaSelect'
import AreaSelectTree from './Address/AreaSelectTree'
import SelectCargoTable from './SelectCargo/table'
import SelectCargo from './SelectCargo/index'
import CargoSelect from './SelectCargo/select'
import Enabled from './Enabled'
import LocationSearch from './LocationSearch'
import SupplierTableSelect from './SupplierTableSelect'
import ShopTableSelect from './ShopTableSelect'
import RailMap from './RailMap'
import PageTitle from './PageTitle'
import UserDept from './UserDept'
import GoodsCatalogSelect from './GoodsCatalog/GoodsCatalogSelect'
import GoodsCatalogTree from './GoodsCatalog/GoodsCatalogTree'
import ShowCatalogSelect from './ShowCatalog/ShowCatalogSelect'
import ShowCatalogTree from './ShowCatalog/ShowCatalogTree'
import CooperateSupplierSelect from './CooperateSupplierSelect'
import PrintButton from './PrintButton'
import WarehouseTableSelect from './WarehouseTableSelect'
import UserInfo from './UserInfo'
import OrgSelect from './OrgSelect'
import CatalogTreeSelect from './CatalogTreeSelect'

const { regeditCmp } = PageSchema
regeditCmp('CheckBoxDate', CheckBoxDate)
regeditCmp('Address', Address)
regeditCmp('ForEverDate', ForEverDate)
regeditCmp('AreaSelect', AreaSelect)
regeditCmp('AreaSelectTree', AreaSelectTree)
regeditCmp('Enabled', Enabled)
regeditCmp('LocationSearch', LocationSearch)
regeditCmp('RailMap', RailMap)
regeditCmp('CargoSelect', CargoSelect)
regeditCmp('SupplierTableSelect', SupplierTableSelect)
regeditCmp('ShopTableSelect', ShopTableSelect)
regeditCmp('UserDept', UserDept)
regeditCmp('GoodsCatalogSelect', GoodsCatalogSelect)
regeditCmp('ShowCatalogSelect', ShowCatalogSelect)
regeditCmp('CooperateSupplierSelect', CooperateSupplierSelect)
regeditCmp('WarehouseTableSelect', WarehouseTableSelect)
regeditCmp('UserInfo', UserInfo)
regeditCmp('OrgSelect', OrgSelect)
regeditCmp('CatalogTreeSelect', CatalogTreeSelect)

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
  GoodsCatalogTree,
  ShowCatalogTree,
  ShowCatalogSelect,
  PrintButton,
  CatalogTreeSelect,
  WarehouseTableSelect,
}
