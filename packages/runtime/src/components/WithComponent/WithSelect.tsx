import React, { useMemo } from "react";

import { ScSelect } from "@scboson/sc-element";
import type { WithSelectProps } from "./interface";
import isFunction from "lodash/isFunction";
import type {
  FormComponentProps,
  FormComponent,
} from "@scboson/sc-element/es/c-form";

export default function WithSelect<
  P extends WithSelectProps & FormComponentProps
>(
  extProps?: P | ((p: P) => P),
  Component: React.ComponentType<any> = ScSelect
) {
  const HotCmp = (p: P) => {
    let props = p;
    if (extProps) {
      if (isFunction(extProps)) {
        props = extProps(p);
      } else {
        props = { ...p, ...extProps };
      }
    }
    const { params, ...restProps } = props;

    const tableParams = useMemo(() => {
      const newPrams = {
        ...params,
        current: 1,
        size: 10,
      };

      return newPrams;
    }, [params]);

    return <Component {...restProps} params={tableParams} />;
  };
  return HotCmp;
}
