import PageSchema from '@scboson/sc-schema'
import CheckBoxDate from './CheckBoxDate'
import Address from './Address'
import ForEverDate from './ForEverDate'
import AreaSelect from './Address/AreaSelect'
import AreaSelectTree from './Address/AreaSelectTree'
import SelectCargoTable from './SelectCargo/table'
import SelectCargo from './SelectCargo/index'

const { regeditCmp } = PageSchema
regeditCmp('CheckBoxDate', CheckBoxDate)
regeditCmp('Address', Address)
regeditCmp('ForEverDate', ForEverDate)
regeditCmp('AreaSelect', AreaSelect)
regeditCmp('AreaSelectTree', AreaSelectTree)

export {
  CheckBoxDate,
  Address,
  ForEverDate,
  AreaSelect,
  AreaSelectTree,
  SelectCargo,
  SelectCargoTable,
}
