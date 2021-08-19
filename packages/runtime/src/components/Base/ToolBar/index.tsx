import React, { useCallback,useMemo } from "react";
import { Button, Space } from "antd";
import Authority from "../../Auth/Authority";
import { useMount } from "ahooks";
const ToolBar = (props) => {
  const { buttons = [], className } = props;

 
  /** 表单顶部合并 以及通用方法引入 */
  const mergedFormButtons = useMemo(() => {
 
    return buttons.map((item: any, index: number) => {
      const buttonProps = item;
      if (React.isValidElement(item)) {
        const newProps = { key: `formButton${index}` };
        return React.cloneElement(item, { ...newProps });
      }
      const { buttonType, text, ...resprops } = buttonProps;
      return (
        // eslint-disable-next-line react/no-array-index-key
        <Button
        
          key={`formButton${index}`}
          className={className}
          {...resprops}
        >
          {text}
        </Button>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttons]);



  if (mergedFormButtons.length>0){

    return <Space size="small">{mergedFormButtons}</Space>
  }

  return null;
};

export default Authority<{className?:string,buttons:any}>(ToolBar);
