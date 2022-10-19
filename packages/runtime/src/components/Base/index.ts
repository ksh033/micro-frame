import PageSchema from '@scboson/sc-schema';
import DictSelect from './DictSelect';
import BsPriceInput from './BsPriceInput';
import BsNumberInput from './BsNumberInput';
import BsUpload from './BsUpload';
import BsImg from './BsImg';
import BsVideo from './BsVideo';
import BsViewImage from './BsViewImage';
import FieldImageName from './FieldImageName';
import Volume from './Volume';
import BsRangePicker from './BsRangePicker';
import BsRangeTimePicker from './BsRangeTimePicker';
import BsIcon from './BsIcon';
import BsEditTable from './BsEditTable';
import BsTimePicker from './BsTimePicker';

const { regeditCmp } = PageSchema;
regeditCmp('DictSelect', DictSelect);
regeditCmp('BsUpload', BsUpload);
regeditCmp('FieldImageName', FieldImageName);
regeditCmp('BsNumberInput', BsNumberInput);
regeditCmp('BsPriceInput', BsPriceInput);
regeditCmp('Volume', Volume);
regeditCmp('BsRangePicker', BsRangePicker);
regeditCmp('BsRangeTimePicker', BsRangeTimePicker);
regeditCmp('BsEditTable', BsEditTable);
regeditCmp('BsTimePicker', BsTimePicker);

export {
  DictSelect,
  BsUpload,
  BsImg,
  BsVideo,
  BsViewImage,
  FieldImageName,
  BsNumberInput,
  BsPriceInput,
  Volume,
  BsRangePicker,
  BsRangeTimePicker,
  BsIcon,
  BsEditTable,
};
