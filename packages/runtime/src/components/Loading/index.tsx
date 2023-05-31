import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./index.less";
// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport

const t = (
  <div className="loading-logo">
    <LoadingOutlined />
  </div>
);
const PageLoading: React.FC = () => (
  <div className="loading-wrapper">
    <Spin spinning indicator={t} />
  </div>
);
export default PageLoading;
