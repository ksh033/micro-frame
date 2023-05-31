import React, { useCallback } from "react";
import { Button } from "antd";
import styles from "./ModalPageTpl.less";
import debounce from "lodash/debounce";

const ModalEditPageTpl: React.FC<any> = (props) => {
  const { toolbar, children, ...restProps } = props;

  /** 表单顶部合并 以及通用方法引入 */
  const mergedFormButtons = useCallback(() => {
    return toolbar.map((item: any, index: number) => {
      const buttonProps = item;
      const { buttonType, text, onClick, ...resprops } = buttonProps;
      const newOnClick = onClick ? debounce(onClick, 300) : undefined;
      return (
        <Button key={`formButton${index}`} {...resprops} onClick={newOnClick}>
          {text}
        </Button>
      );
    });
  }, [toolbar]);

  return (
    <div className={styles["modal-page"]} {...restProps}>
      <div className={styles["modal-page-content"]}>{children}</div>
      {toolbar ? (
        <div className={`ant-modal-footer ${styles["modal-page-footer"]}`}>
          {mergedFormButtons()}
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(ModalEditPageTpl);
