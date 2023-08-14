/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { PageContainer as APageContainer, LayoutContext } from "@scboson/sc-layout";
import type { PageContainerProps } from "@scboson/sc-layout";
import AuthButton from "../../Auth/AuthButton";
import "./index.less";
import { HButtonType } from "@scboson/sc-schema/es/interface";
import debounce from "lodash/debounce";
import { useMount,useSize } from "ahooks";

export type ScPageContainerProps = Omit<PageContainerProps, "footer"> & {
  footer?: HButtonType[];
};

const PageContainer: React.FC<ScPageContainerProps> = (props) => {
  const { children, footer,...restProps } = props;

 const conRef=useRef<HTMLDivElement>();
 //const ref = useRef(null);
 const size = useSize(conRef);

  const efooter:any = useMemo(() => {
    /** 表单顶部合并 以及通用方法引入 */
    let mergedFormButtons: React.ReactNode[] = [];
    if (Array.isArray(footer)) {
      mergedFormButtons = footer.map((item: any, index: number) => {
        const buttonProps = item;
        if (React.isValidElement(item)) {
          const newProps = { key: `formButton${index}` };
          return React.cloneElement(item, { ...newProps });
        }
        const { buttonType, text, onClick, ...resprops } = buttonProps;
        const newOnClick = onClick ? debounce(onClick, 250) : undefined;
        return (
          <AuthButton
            key={`formButton${index}`}
            {...resprops}
            onClick={newOnClick}
          >
            {text}
          </AuthButton>
        );
      });
    }
    return mergedFormButtons;
  }, [footer]);


  // const context=useContext(LayoutContext);

  // useEffect(()=>{
  //    if (context.setPageContainerHeight) {
  //     if (size){
  //       if (size.height!==context.pageContainerHeight)
  //       context.setPageContainerHeight(size.height)
  //       console.log("PageContainer Change",size)
  //     }

  //    }
   
  //   console.log("PageContainer",size)

  // },[size?.height])
  // useMount(()=>{

  //   if (conRef.current){
  //    if (context.setPageContainerHeight) {
  //     context.setPageContainerHeight(conRef.current.getBoundingClientRect().height)

  //    }
   
  //     console.log("PageContainer",conRef.current,  conRef.current.getBoundingClientRect(),   conRef.current.clientHeight)
  //   }

  // })
  return (
    //@ts-ignore
    <div tabIndex={1}  className="sc-page-container">
      <APageContainer {...restProps} footer={efooter}>
     {children}
      </APageContainer>
    </div>
  );
};

export default PageContainer;
