import React, { useState, useMemo, useRef } from "react";
import { Button, Input } from "antd";
import { CModal } from "@scboson/sc-element";
import BsEditTable from "../Base/BsEditTable";
import type { WithTableProps, WithSelectTableProps } from "./interface";

import type {
  FormComponentProps,
  FormComponent,
} from "@scboson/sc-element/es/c-form";

export default function WithSelectTable<
  P extends WithSelectTableProps & WithTableProps & FormComponentProps
>(
  Component: React.ComponentType<any> | FormComponent<any>,
  /** 是否自定义渲染 */
  isExtends?: boolean,
  extendsProps?: {
    /** 业务数据转表格数据 */
    normalize?: (value: any, rowKey?: string) => any;
    /*
     * 选择中的表格数据转业务数据
     */
    getValueProps?: (rowDatas: any, rowKey?: string) => any;
  }
): FormComponent<P> {
  let HocCmp: FormComponent<P>;
  if (isExtends) {
    HocCmp = (props: P) => {
      const mergProps = { ...props, ...extendsProps };
      const {
        getValueProps,
        type,
        onOk,
        //buttonText = '选择',
        value,
        onChange,
        normalize,
        textPropName,
        tableProps,
        dataRef,
        onTabelRow: customOnTableRow,
        //disabled,
        // readonly,
        ...restProps
      } = mergProps;

      let ref = useRef<{ selectedRows?: any[]; selectedKeys?: any[] }>({});
      if (dataRef) {
        ref = dataRef;
      }

      const setRef = (obj: { selectedRows?: any[]; selectedKeys?: any[] }) => {
        ref.current = obj;
      };
      //const [cmpValue, setCmpValue] = useState<any>(null);

      const onTabelRow = (_keys: any, selectRows: any[]) => {
        if (selectRows.length > 0) {
          ref.current.selectedKeys = _keys;
          ref.current.selectedRows = selectRows;
        } else {
          ref.current.selectedRows = [];
          ref.current.selectedKeys = [];
        }

        customOnTableRow &&
          customOnTableRow(
            ref.current.selectedKeys || [],
            ref.current.selectedRows
          );
      };
      const okClick = () => {
        if (ref.current.selectedRows) {
          let megData: any = ref.current.selectedRows;
          if (getValueProps) {
            megData = getValueProps(ref.current.selectedRows, restProps.rowKey);
          }
          // setCmpValue(ref.current.selectedRows);
          // onChange?.(megData);

          return megData;
        }
        return null;
      };
      const val = useMemo(() => {
        let tval = value;
        if (normalize) {
          tval = normalize(value, restProps.rowKey);
        }
        return tval;
      }, [normalize, value]);
      return (
        <Component
          {...restProps}
          onOk={okClick}
          // value={val}
          value={value}
          onChange={onChange}
          selectedRows={val}
          setRef={setRef}
          //selectedRowKeys={ref.current?.selectedKeys}
          onTabelRow={onTabelRow}
        />
      );
    };
  } else {
    HocCmp = (props: P) => {
      const {
        getValueProps,
        type,
        onOk,
        buttonText = "选择",
        value,
        onChange,
        normalize,
        textPropName,
        tableProps,
        dataRef,
        readonly,
        disabled,
        ...restProps
      } = props;
      let ref = useRef<{ selectedRows?: any[]; selectedKeys?: any[] }>({});
      if (dataRef) {
        ref = dataRef;
      }
      const [cmpValue, setCmpValue] = useState<any>(null);

      const onTabelRow = (_keys: any, selectRows: any[]) => {
        if (selectRows.length > 0) {
          // const selectedRows = selectRows.map((item: any, index) => {
          //   let retVal = {};
          //   if (isFunction(getSelectedProps)) {
          //     retVal = getSelectedProps(item, index);
          //   } else {
          //     Object.keys(getSelectedProps).forEach((key) => {
          //       retVal[key] = item[getSelectedProps[key]];
          //     });
          //   }
          //   return retVal;
          // });
          ref.current.selectedKeys = _keys;
          ref.current.selectedRows = selectRows;
        } else {
          ref.current.selectedRows = [];
          ref.current.selectedKeys = [];
        }
      };

      const dlgcontent = useMemo(() => {
        let val = value || cmpValue;
        if (normalize) {
          val = normalize(val);
        }
        return (
          <Component
            {...restProps}
            dataRef={ref}
            selectedRows={val}
            //selectedRowKeys={ref.current?.selectedKeys}
            onTabelRow={onTabelRow}
          />
        );
      }, [value, cmpValue, normalize, restProps]);

      const onClickSelect = () => {
        CModal.show({
          content: dlgcontent,

          onOk: () => {
            if (ref.current.selectedRows) {
              let megData: any = ref.current.selectedRows;
              if (getValueProps) {
                megData = getValueProps(ref.current.selectedRows);
              }
              setCmpValue(megData);
              onChange?.(megData);
              if (onOk) {
                onOk(megData);
              }
            }
          },
        });
      };
      const showCmp = useMemo(() => {
        let retVal: any = null;
        if (type === "select") {
          const title =
            cmpValue?.[`${textPropName}`] || value?.[`${textPropName}`];
          retVal = !readonly ? (
            <Input
              value={title}
              disabled={disabled}
              addonAfter={<Button size="small" type="link" />}
            />
          ) : null;
        } else {
          retVal = (
            <>
              {!readonly ? (
                <Button
                  type="primary"
                  disabled={disabled}
                  onClick={onClickSelect}
                >
                  {buttonText}
                </Button>
              ) : null}
              <BsEditTable
                value={value || cmpValue}
                onChange={onChange}
                {...tableProps}
                type="multiple"
              />
            </>
          );
        }
        return retVal;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [cmpValue, type, value, readonly, disabled]);

      return showCmp;
    };
  }

  return HocCmp;
}
