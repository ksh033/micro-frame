import React, { useRef } from 'react';
import { Card } from 'antd';
import ToolBar from '@/components/Base/ToolBar';
import styles from './PageTpl.less';

const ModalEditPageTpl: React.FC<any> = props => {
  const { toolbar, title, children, cardProps } = props;

  const ref = useRef<any>();

  // /**
  //  * 表单顶部合并 以及通用方法引入
  //  */
  // const mergedFormButtons = useCallback(() => {
  //   return toolbar.map((item: any, index: number) => {
  //     const buttonProps = item;
  //     const { buttonType, funCode, text, ...resprops } = buttonProps;
  //     return (

  //       <AuthButton key={`formButton${index}`} {...resprops}>
  //         {text}
  //       </AuthButton>
  //     );
  //   });
  // }, [toolbar]);

  return (
    <>
      <div className={styles['tpl-page']} ref={ref}>
        <Card bordered={false} title={title} {...cardProps}>
          <div className={styles['tpl-page-content']}>{children}</div>
        </Card>
        {toolbar ? (
          <div className="ant-modal-footer tpl-page-footer">
            <ToolBar buttons={toolbar} className="" />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default React.memo(ModalEditPageTpl);
