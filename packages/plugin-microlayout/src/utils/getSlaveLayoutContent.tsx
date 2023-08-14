import { LayoutConfig } from "../types/interface.d";
export default (
  userConfig: LayoutConfig,
  path: string
) => `import React, { useState, useEffect } from "react";

import 'antd/es/style/reset.css';
import LayoutComponent from '${path}';

export default props => {

  const userConfig = {
    ...${JSON.stringify(userConfig).replace(/"/g, "'")},
   
  };


  return React.createElement(LayoutComponent, {
    userConfig,
    ...props
  });
};
`;
