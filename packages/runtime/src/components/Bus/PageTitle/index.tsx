import React from "react";
import { Space, Tag } from "antd";
import userDictModel from "../../../components/Dict/userDictModel";

export type PageTitleProps = {
  status: string;
  title: string;
  statusName: string;
};

const PageTitle: React.FC<any> = (props) => {
  const { statusName, title, status } = props;
  const { getDistList } = userDictModel();

  const rlist = getDistList({
    dictTypeCode: statusName,
  });
  const map = new Map();
  if (Array.isArray(rlist)) {
    rlist.forEach((item) => {
      map.set(item.value, item.name);
    });
  }

  return (
    <Space>
      <span>{title}</span>
      <span>{status ? <Tag color="#f50">{map.get(status)}</Tag> : ""}</span>
    </Space>
  );
};

export default PageTitle;
