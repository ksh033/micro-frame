/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useState } from "react";
import { ScTreeSelect } from "@scboson/sc-element";
import type {
  FormComponent,
  FormComponentProps,
} from "@scboson/sc-element/es/c-form";
import { uesRequest } from "../../../utils/api";

export interface AreaDataProps {
  areaCode: string;
  areaLevel: string;
  areaName: string;
}

export interface AreaSelecthProps extends FormComponentProps {
  placeholder?: string;
  form?: any;
  county?: boolean;
  style?: any;
  value?: any;
  onChange?: any;
  data: any;
  root: any;
  dispatch: any;
  modelKey: any;
  checkbox?: boolean;
  fieldProps?: any;
  multiple?: boolean;
  labelInValue?: boolean;
  param?: any;
}
/**
 * 商品品目
 *
 * @param props
 * @returns
 */
const CatalogTreeSelect: FormComponent<AreaSelecthProps> = (
  props: AreaSelecthProps = {
    data: [],
    root: null,
    dispatch: null,
    modelKey: null,
  }
) => {
  const { run } = uesRequest("catalog", "treeData");
  const [treeValue, setTreeValue] = useState<any>();
  const {
    form,
    placeholder,
    style,
    data = [],
    county,
    value,
    onChange,
    readonly,
    fieldProps,
    labelInValue = true,
    multiple = false,
    param,
    ...restProps
  } = props;

  const params = useMemo(() => {
    return { parentCatalogCode: "0", ...param };
  }, []);

  const onSelectChange = (rvalue: any, option: any) => {
    if (!multiple) {
      setTreeValue(rvalue);
      if (onChange) {
        onChange(
          labelInValue
            ? {
                catalogCode: option.catalogCode,
                catalogId: option.catalogId,
                value: option.catalogId,
                label: option.catalogName,
              }
            : option.catalogId
        );
      }
    }
  };

  useEffect(() => {
    if (value && !treeValue) {
      onChange?.(value);
      if (multiple) {
        setTreeValue(value);
      } else {
        setTreeValue({
          ...value,
          value: value.catalogId,
          label: value.catalogName || value.label,
        });
      }
    }
  }, [JSON.stringify(value)]);

  const loadDataPramsFormat = (item: any) => {
    return {
      parentCatalogCode: item.catalogCode,
      ...param,
    };
  };

  const onValueChange = (rvalue: any) => {
    if (multiple) {
      setTreeValue(rvalue);
      onChange?.(rvalue);
    } else {
      if (rvalue === undefined) {
        onChange?.(rvalue);
        setTreeValue(rvalue);
      }
    }
  };

  const render = () => {
    if (readonly) {
      let text = "";
      if (treeValue) {
        text = multiple
          ? treeValue
              .map((item: any) => {
                return item.label;
              })
              .join(",")
          : treeValue.label;
      }
      return <>{text}</>;
    }
    return (
      <ScTreeSelect
        textField="catalogName"
        valueField="catalogId"
        params={params}
        onSelect={onSelectChange}
        onChange={onValueChange}
        multiple={multiple}
        labelInValue={labelInValue}
        value={treeValue}
        loadDataPramsFormat={loadDataPramsFormat}
        request={run}
        autoload
        data={data}
        placeholder="请选择品目"
        {...restProps}
      ></ScTreeSelect>
    );
  };
  return <>{render()}</>;
};
CatalogTreeSelect.customView = true;

export default CatalogTreeSelect;
