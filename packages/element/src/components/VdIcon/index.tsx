// import { createFromIconfontCN } from '@ant-design/icons';
// // const iconfont = require('./iconfont');
// const VdIcon = createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_3309387_6njmdred1hq.js',
// });
// export default VdIcon;
import React from 'react';
import './index.less';
type VdIconProps = {
  type: string;
};

const VdIcon: React.FC<VdIconProps> = (props) => {
  return <i className={props.type}></i>;
};
export default VdIcon;
