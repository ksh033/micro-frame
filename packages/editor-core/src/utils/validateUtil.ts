import { ProFormColumnsType } from '@ant-design/pro-form/es';
import { message } from 'antd';
import Schema from 'async-validator';
import { isPromise } from './common';

export function validateRules(
  columns: ProFormColumnsType[],
  record: any,
): Promise<Boolean> {
  const getFieldValue = (name: string) => {
    return record[name];
  };

  const descriptor: any = {};
  columns.forEach((item: ProFormColumnsType) => {
    if (item.formItemProps) {
      let rules = item.formItemProps['rules'];
      if (Array.isArray(rules)) {
        rules = rules.filter((it) => it != null);
      } else {
        rules = [];
      }

      if (item.dataIndex && rules.length > 0) {
        const name = JSON.stringify(item.dataIndex) || '';
        descriptor[`${name.replace(/"/g, '')}`] = rules.map((it: any) => {
          if (typeof it === 'function') {
            const item = it({
              getFieldValue,
            });
            if (isPromise(item.validator)) {
              const itemValidator = item.validator;
              delete item.validator;
              return {
                ...item,
                asyncValidator: itemValidator,
              };
            } else {
              return item;
            }
          }
          return it;
        });
      }
    }
  });
  const validator = new Schema(descriptor);
  console.log('descriptor', descriptor);
  return new Promise((resolve, rejust) => {
    validator
      .validate(record, { first: true })
      .then(() => {
        resolve(true);
      })
      .catch(({ errors, fields }) => {
        console.log('errors', errors);
        console.log('fields', fields);
        if (Array.isArray(errors) && errors.length > 0) {
          message.error(`${errors[0].message}`);
          console.log(errors);
          resolve(false);
        }
      });
  });
}
