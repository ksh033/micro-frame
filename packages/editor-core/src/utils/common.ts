import isNil from 'lodash/isNil';
import cloneDeep from 'lodash/cloneDeep';
// @ts-ignore
import { VdProFormColumnsType } from '@scvisual/element';
import { Rules } from 'async-validator/dist-types/interface';
import { ProFormColumnsType } from '@ant-design/pro-form';
import { valueTypelist } from '../index';

const defaultFormItemProps = {
  className: 'deco-control-group',
};

export function genNonDuplicateId(randomLength: number | undefined = 10) {
  let idStr = Date.now().toString(36);
  idStr += Math.random().toString(36).substr(3, randomLength);
  return idStr;
}

const isNoStyle = (valueType: string) => {
  return valueTypelist.indexOf(valueType) > -1;
};

const converFormItem = (
  list: VdProFormColumnsType[],
  columnList: ProFormColumnsType[]
) => {
  if (Array.isArray(list)) {
    list.forEach((it: VdProFormColumnsType) => {
      const valueType = it.valueType;
      const { columns, ...restIt } = it;
      let newItem: ProFormColumnsType<any, any> = restIt;
      let newColumns: ProFormColumnsType[] = [];
      if (Array.isArray(columns) && columns.length > 0) {
        converFormItem(columns, newColumns);
        newItem.columns = newColumns;
      }
      if (isNil(newItem.formItemProps)) {
        newItem.formItemProps = {};
      }
      if (isNil(newItem.fieldProps)) {
        newItem.fieldProps = {};
      }

      const formItemProps = Object.assign(
        {},
        defaultFormItemProps,
        newItem.formItemProps
      );
      newItem.formItemProps = formItemProps;
      if (it && typeof it.valueType === 'string') {
        const valueType: string = it.valueType || '';
        if (isNoStyle(valueType)) {
          newItem.formItemProps = {
            ...formItemProps,
            label: undefined,
          };
          newItem.fieldProps['formItem'] = {
            name: it.dataIndex,
            label: it.title,
          };
          if (valueType === 'VdDivider') {
            newItem.formItemProps.noStyle = true;
          }
        }
      }

      columnList.push(newItem);
    });
  }
};
export function isPromise(obj: any) {
  return (
    !!obj && //有实际含义的变量才执行方法，变量null，undefined和''空串都为false
    (typeof obj === 'object' || typeof obj === 'function') && // 初始promise 或 promise.then返回的
    typeof obj.then === 'function'
  );
}

export const filterPageConfig = (
  propsConfig: VdProFormColumnsType<any>[]
): ProFormColumnsType[] => {
  let itemInfos: VdProFormColumnsType<any>[] = cloneDeep(propsConfig);
  const newColumn: ProFormColumnsType[] = [];
  converFormItem(itemInfos, newColumn);

  return newColumn;
};

export function getType(obj: any) {
  // @ts-ignore
  var type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase();

  if (obj === null) return 'null'; // PhantomJS has type "DOMWindow" for null

  if (obj === undefined) return 'undefined'; // PhantomJS has type "DOMWindow" for undefined

  return type;
}

export const ObjToMap = (value: any) => {
  if (getType(value) === 'map') {
    return value;
  }

  return new Map(Object.entries(value || {}));
};

export function proFieldParsingValueEnumToArray(valueEnumParams: any) {
  var enumArray: any[] = [];
  var valueEnum = ObjToMap(valueEnumParams);
  valueEnum.forEach(function (_: any, key: string) {
    var value = valueEnum.get(key) || valueEnum.get(''.concat(key));

    if (!value) {
      return;
    }

    if (
      getType(value) === 'object' &&
      (value === null || value === void 0 ? void 0 : value.text)
    ) {
      enumArray.push({
        text: value === null || value === void 0 ? void 0 : value.text,
        value: key,
        label: value === null || value === void 0 ? void 0 : value.text,
        disabled: value.disabled,
        icon: value.icon,
      });
      return;
    }

    enumArray.push({
      text: value,
      value: key,
    });
  });
  return enumArray;
}

export function getRequiresNameList(rules: Rules): string[] {
  const list: string[] = [];
  Object.keys(rules).forEach((key) => {
    const it = rules[key];
    if (Array.isArray(it)) {
      const index = it.findIndex((item) => item.required);
      if (index > -1) {
        list.push(key);
      }
    } else {
      if (it.required) {
        list.push(key);
      }
    }
  });
  return list;
}

export function getIframeDocument(iframeId: string) {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
  if (iframe.contentDocument) {
    return iframe.contentDocument;
  } else if (iframe.contentWindow) {
    return iframe.contentWindow.document;
  } else {
    return null;
  }
}

export function getIframeDocumentByElement(iframe: HTMLIFrameElement) {
  if (iframe.contentDocument) {
    return iframe.contentDocument;
  } else if (iframe.contentWindow) {
    return iframe.contentWindow.document;
  } else {
    return null;
  }
}
