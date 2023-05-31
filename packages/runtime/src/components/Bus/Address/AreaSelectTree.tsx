import React, { useEffect, useMemo, useState } from "react";
import { uesRequest } from "../../../utils/api";
import { ScTreeSelect } from "@scboson/sc-element";
import {
  FormComponent,
  FormComponentProps,
} from "@scboson/sc-element/es/c-form";

export interface AreaDataProps {
  areaCode: string;
  areaLevel: string;
  areaName: string;
}

export interface AreaSelecthProps extends FormComponentProps {
  placeholder?: string;
  form?: any;
  // areaLevel?: AreaLevel | undefined;
  province?: boolean;
  city?: boolean;
  district?: boolean;
  county?: boolean;
  style?: any;
  value?: any;
  onChange?: any;
  data: any;
  root: any;
  dispatch: any;
  modelKey: any;
  checkbox?: boolean;
}

const AareSelect: FormComponent<AreaSelecthProps> = (
  props: AreaSelecthProps = {
    data: [],
    root: null,
    dispatch: null,
    modelKey: null,
  }
) => {
  const { run } = uesRequest("system", "areaList");
  const [treeValue, setTreeValue] = useState<any>();
  const {
    form,
    province = true,
    city = true,
    placeholder,
    style,
    district = true,
    data = [],
    county,
    value,
    onChange,
    readonly,
    checkbox = false,
    initialValues,
    ...restProps
  } = props;
  let areaLevel = -1;
  if (province) {
    areaLevel += 1;
  }
  if (city) {
    areaLevel += 1;
  }
  if (district) {
    areaLevel += 1;
  }
  if (county) {
    areaLevel += 1;
  }

  const params = useMemo(() => {
    return { parentId: "0" };
  }, []);

  const onValueChange = (_value: any) => {
    setTreeValue(_value);
    if (onChange) {
      onChange(_value);
    }
  };

  useEffect(() => {
    if (value && !treeValue) {
      let _formValue: any[] = [];
      _formValue = value.map((element: any) => {
        let areaName = "";
        if (element.value && element.label) {
          return element;
        } else {
          const { areaCode } = element;
          if (province) {
            areaName = element["provinceName"];
          }
          if (city) {
            areaName = element["cityName"];
          }
          if (district) {
            areaName = element["districtName"];
          }
          if (county) {
            areaName = element["countyName"];
          }

          return { label: areaName, key: areaCode, value: areaCode };
        }
      });
      onChange && onChange(_formValue);
      setTreeValue(_formValue);
    }
  }, [JSON.stringify(value)]);

  const onLoad = (_data: AreaDataProps[]) => {
    if (Array.isArray(_data)) {
      return _data.map((item: any) => {
        if (areaLevel) {
          item.isLeaf = item.areaLevel === `${areaLevel}`;
        } else {
          item.isLeaf = false;
        }
        if (!checkbox && item.areaLevel !== "2") {
          item.checkable = false;
          item.selectable = false;
        }
        return item;
      });
    }
    return null;
  };

  const render = () => {
    if (readonly) {
      let text = [];
      if (treeValue) {
        text = treeValue.map(({ label }: any) => label);
      }
      return <>{text.join(",")}</>;
    } else {
      return (
        <ScTreeSelect
          textField="fullName"
          valueField="areaCode"
          params={params}
          onChange={onValueChange}
          multiple
          labelInValue
          value={treeValue}
          treeCheckable
          onLoad={onLoad}
          request={run}
          autoload
          data={data}
          placeholder="请选择地址"
          {...restProps}
        ></ScTreeSelect>
      );
    }
  };
  return <>{render()}</>;
};
AareSelect.customView = true;

export default AareSelect;
