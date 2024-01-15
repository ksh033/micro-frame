import { DownOutlined } from "@ant-design/icons";
import { HButtonType } from "@scboson/sc-schema/es/interface";
import { Button, Divider, Dropdown, Menu } from "antd";
import React, { PropsWithChildren, useCallback } from "react";
import BsTableButton from "./BsTableButton";

export interface OperationProps {
  max: number;
  record: any;
  buttons: HButtonType[];
  config: any;
  reload: () => void;
}

const Operation: React.FC<PropsWithChildren<OperationProps>> = (props) => {
  const { buttons, max = 4 } = props;
  const renderChild = useCallback(() => {
    const children: any[] = [];
    const moreButtons: any[] = [];
    const { length } = buttons;
    buttons.forEach((item: HButtonType, index: number) => {
      if (index < max) {
        if (React.isValidElement(item)) {
          const newProps = { key: `bt_${index}` };
          children.push(React.cloneElement(item, { ...newProps }));
        } else {
          //@ts-ignore
          children.push(<BsTableButton {...item} key={`bt_${index}`} />);
        }
        if (index !== length - 1) {
          // eslint-disable-next-line react/no-array-index-key
          children.push(<Divider key={`d_${index}`} type="vertical" />);
        }
      } else {
        if (React.isValidElement(item)) {
          const newProps = { key: `bt_${index}` };
          moreButtons.push(
            <Menu.Item key={index}>
              {React.cloneElement(item, { ...newProps })}
            </Menu.Item>
          );
        } else {
          moreButtons.push(
            <Menu.Item key={index}>
              <BsTableButton
                {...item}
                key={`bt_${index}`}
                type="text"
                style={{ padding: 0 }}
              />
            </Menu.Item>
          );
        }
      }
    });
    if (moreButtons.length > 0) {
      const menu = <Menu>{moreButtons}</Menu>;
      children.push(
        <Dropdown key={"moreBtn"} overlay={menu}>
          <Button type="link">
            更多
            <DownOutlined />
          </Button>
        </Dropdown>
      );
    }

    return children;
  }, [buttons, max]);

  return (
    <div className={"sc-table-operation"} style={{ display: "inline-block" }}>
      {renderChild()}
    </div>
  );
};

export default React.memo(Operation);
