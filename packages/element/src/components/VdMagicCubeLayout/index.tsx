import _ from 'lodash';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { ExtendVdFormItemProps } from '../VdFormItem';
import {
  CompontentItem,
  getDefaultTemplateCompontents,
  templateMap,
} from './template';
import './index.less';
import CubeTemplate from './CubeTemplate';
import VdImgLink, { VdImgLinkState } from '../VdImgLink';

type ValueState = {
  sub_entry: CompontentItem[];
  width: number;
  height: number;
};

export type VdMagicCubeLayoutProps = ExtendVdFormItemProps & {
  value: ValueState;
  onChange: (val: ValueState) => void;
  rowData: any;
  templateDataIndex: string;
};

export const MethodLength = 8 - 1;
const VdMagicCubeLayout: React.FC<VdMagicCubeLayoutProps> = (props) => {
  const {
    formItem,
    rowData,
    templateDataIndex,
    value = {
      sub_entry: [],
      width: 0,
      height: 0,
    },
    onChange,
    ...rest
  } = props;
  const templateId = rowData[templateDataIndex] || '0';
  const templateItemMap = templateMap[templateId];
  const [subEntryIndex, setSubEntryIndex] = useState<number>(0);

  useLayoutEffect(() => {
    let newList = getDefaultTemplateCompontents(templateId);

    if (Array.isArray(value.sub_entry) && value.sub_entry.length > 0) {
      newList = newList.map((item, index) => {
        const valitem: any = value.sub_entry[index];
        if (valitem) {
          return {
            ...valitem,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
          };
        }
        return item;
      });
    }

    onChange?.({
      width: templateItemMap.rowSpan,
      height: templateItemMap.colSpan,
      sub_entry: newList,
    });
  }, [templateId]);

  const list = useMemo(() => {
    return Array.isArray(value.sub_entry) ? value.sub_entry : [];
  }, [JSON.stringify(value)]);

  const setList = (newList: CompontentItem[]) => {
    console.log(newList);
    if (Array.isArray(newList)) {
      onChange?.({
        ...value,
        sub_entry: newList,
      });
    }
  };

  const setDensity = (density: number) => {
    console.log(density);
    onChange?.({
      ...value,
      width: density,
      height: density,
    });
  };

  const onSubEnterHandleChange = (val: VdImgLinkState) => {
    if (val) {
      const newList = JSON.parse(JSON.stringify(list));
      let newItem = newList[subEntryIndex];
      newItem = Object.assign({}, newItem, val || {});
      newList.splice(subEntryIndex, 1, newItem);
      onChange?.({
        ...value,
        sub_entry: newList,
      });
    }
  };

  return (
    <React.Fragment>
      <CubeTemplate
        formItemName={formItem?.label}
        density={value.width}
        setDensity={setDensity}
        list={list}
        value={value}
        setList={setList}
        subEntryIndex={subEntryIndex}
        setSubEntryIndex={setSubEntryIndex}
        templateId={Number(templateId)}
      />
      {Array.isArray(list) && list.length > 0 ? (
        <VdImgLink
          onChange={onSubEnterHandleChange}
          value={list[subEntryIndex]}
        ></VdImgLink>
      ) : null}
    </React.Fragment>
  );
};

export default VdMagicCubeLayout;
