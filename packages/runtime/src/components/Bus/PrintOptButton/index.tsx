import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import { DropdownProps } from "antd/es/dropdown/dropdown";
import React from "react";
import { print, PrintTplType } from "../../../utils/print";

export const PrintType = PrintTplType;
export type PrintButtonProp = {
  printType: PrintTplType | string;
  form?: any;
  children?: any;
  preview?: boolean;
  callBack?: Function;
  getParams?: () => any;
  text?: string;
} & Omit<DropdownProps, "overlay">;
/**
 * 字典控件
 *
 * @param pros 字典控件属性
 */
const PrintButton: React.FC<PrintButtonProp> = (pros: PrintButtonProp) => {
  const {
    printType,
    form,
    preview = false,
    children,
    getParams,
    callBack,
    text = "打印",
    ...restProps
  } = pros;

  const getParam = () => {
    let params = {};
    if (getParams) {
      params = getParams();
    }
    return params;
  };

  const menuClick = async (obj: any) => {
    const params = await getParam();

    if (obj.key === "a4") {
      print(printType, { params });
    }

    if (obj.key === "zhen") {
      const newModuleId = printType + "1";
      print(newModuleId, { params });
    }
  };

  const menu = (
    <Menu onClick={menuClick} style={{ zIndex: 999 }}>
      <Menu.Item key="a4">A4打印</Menu.Item>
      <Menu.Item key="zhen">针式打印</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={["click"]} {...restProps}>
      <Button type="link">
        {text}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};
export default PrintButton;
