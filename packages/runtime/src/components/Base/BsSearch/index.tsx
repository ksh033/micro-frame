import { ScSearchBar } from "@scboson/sc-element";

import   "./index.less";

const BsSearch = (props: any) => {
  const { customBtn, ...resProps } = props;

 // const hasToolBar = Array.isArray(toolbar) && toolbar.length > 0;

  return (
    <>
     
    
        <ScSearchBar className={"bs-supplier-search"} {...resProps} customBtn={customBtn}></ScSearchBar>
     
    </>
  );
};

export default BsSearch;
