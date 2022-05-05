/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import { PageContainer as APageContainer } from '@scboson/sc-layout';
import type { PageContainerProps } from '@scboson/sc-layout';
import AuthButton from '../../Auth/AuthButton';
import './index.less';
import { HButtonType } from '@scboson/sc-schema/es/interface';

export type ScPageContainerProps = Omit<PageContainerProps, 'footer'> & {
  footer?: HButtonType[];
};

const PageContainer: React.FC<ScPageContainerProps> = (props) => {
  const { children, footer } = props;

  const efooter = useMemo(() => {
    /** 表单顶部合并 以及通用方法引入 */
    let mergedFormButtons: React.ReactNode[] = [];
    if (Array.isArray(footer)) {
      mergedFormButtons = footer.map((item: any, index: number) => {
        const buttonProps = item;
        if (React.isValidElement(item)) {
          const newProps = { key: `formButton${index}` };
          return React.cloneElement(item, { ...newProps });
        }
        const { buttonType, text, ...resprops } = buttonProps;
        return (
          <AuthButton key={`formButton${index}`} {...resprops}>
            {text}
          </AuthButton>
        );
      });
    }
    return mergedFormButtons;
  }, [footer]);

  return (
    <APageContainer {...props} footer={efooter}>
      {children}
    </APageContainer>
  );
};

export default PageContainer;
