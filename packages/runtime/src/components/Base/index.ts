import PageSchema from '@scboson/sc-schema'
import DictSelect from './DictSelect'
import BsPriceInput from './BsPriceInput'
import BsUpload from './BsUpload'
import BsImg from './BsImg'
import BsVideo from './BsVideo'
import BsViewImage from './BsViewImage'
import FieldImageName from './FieldImageName'

const { regeditCmp } = PageSchema
regeditCmp('DictSelect', DictSelect)
regeditCmp('BsUpload', BsUpload)
regeditCmp('FieldImageName', FieldImageName)
regeditCmp('BsPriceInput', BsPriceInput)

export {
  DictSelect,
  BsUpload,
  BsImg,
  BsVideo,
  BsViewImage,
  FieldImageName,
  BsPriceInput,
}
