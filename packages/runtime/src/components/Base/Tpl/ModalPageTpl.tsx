import React, { useCallback } from 'react';
import { Button } from 'antd';
import styles from './ModalPageTpl.less';

const ModalEditPageTpl: React.FC<any> = props => {
  const { toolbar, children,...restProps } = props;

  /**
   * 表单顶部合并 以及通用方法引入
   */
  const mergedFormButtons = useCallback(() => {
    return toolbar.map((item: any, index: number) => {
      const buttonProps = item;
      const { buttonType, text, ...resprops } = buttonProps;
      return (
        <Button key={`formButton${index}`} {...resprops}>
          {text}
        </Button>
      );
    });
  }, [toolbar]);

  return (
    <div className={styles['modal-page']} {...restProps}>
      <div className={styles['modal-page-content']}>{children}</div>
      {toolbar ? (
        <div className={`ant-modal-footer ${styles['modal-page-footer']}`}>
          {mergedFormButtons()}
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(ModalEditPageTpl);
