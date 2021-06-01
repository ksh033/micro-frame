import React, { useCallback } from 'react';
import { Button } from 'antd';
import Authority from '../../Auth/Authority';

const AuthButton = Authority(Button);
const ToolBar: React.FC<any> = props => {
  const { buttons = [], className } = props;

  /**
   * 表单顶部合并 以及通用方法引入
   */
  const mergedFormButtons = useCallback(() => {
    return buttons.map((item: any, index: number) => {
      const buttonProps = item;
      if (React.isValidElement(item)) {
        const newProps = { key: `formButton${index}` };
        return React.cloneElement(item, { ...newProps });
      }
      const { buttonType, text, ...resprops } = buttonProps;
      return (
        // eslint-disable-next-line react/no-array-index-key
        <AuthButton key={`formButton${index}`} className={className} {...resprops}>
          {text}
        </AuthButton>
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttons]);
  return <>{mergedFormButtons()}</>;
};

export default ToolBar;
