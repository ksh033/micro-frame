import { ProFormColumnsType } from '@ant-design/pro-form/es'
import { message } from 'antd'
import Schema from 'async-validator'
export function validateRules(
  columns: ProFormColumnsType<any>[],
  record: any
): Promise<Boolean> {
  const descriptor: any = {}
  columns.forEach((item: ProFormColumnsType) => {
    // @ts-ignore
    const rules = item.formItemProps?.rules

    if (item.dataIndex && rules) {
      const name = JSON.stringify(item.dataIndex) || ''
      if (Array.isArray(rules)) {
        descriptor[`${name.replace(/"/g, '')}`] = rules.map((it: any) => {
          if (it.required) {
            return {
              ...it,
              type: it.type ? it.type : 'string',
              transform(val: any) {
                if (val !== undefined && val !== null && val !== '') {
                  return String(val).trim()
                }
                return val
              },
            }
          }
          return {
            ...it,
            type: it.type ? it.type : 'string',
          }
        })
      }
    }
  })
  const validator = new Schema(descriptor)
  return new Promise((resolve, rejust) => {
    validator
      .validate(record, { first: true })
      .then(() => {
        resolve(true)
      })
      .catch(({ errors, fields }) => {
        if (Array.isArray(errors) && errors.length > 0) {
          message.error(`${errors[0].message}`)
        }

        console.log(errors)
        resolve(false)
      })
  })
}
