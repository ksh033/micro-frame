import type { FC } from 'react'
import { Form, Input, message } from 'antd'
import ModalPageContainer from '../../../components/Base/Tpl/ModalPageTpl'
import { CModal } from '@scboson/sc-element'

const { TextArea } = Input
type AddExpenseModalProps = {
  close: () => void
  pageProps: {
    warning?: string
    title?: string
    params?: {}
    listValueFiled?: string
    addList?: (list: any[]) => void
    request: (params: any) => Promise<any> // 请求数据的远程方法
  }
}

const BatchCopyAddModal: FC<AddExpenseModalProps> = (props) => {
  const { close, pageProps = { request: Promise.resolve, params: {} } } = props
  const {
    request = Promise.resolve,
    params = {},
    addList,
    warning = '请在下方粘贴从excel复制的信息',
    title = '批量添加货品',
    listValueFiled = 'cargoCodeList',
  } = pageProps
  const [form] = Form.useForm()

  const formatContent = (content: string) => {
    const list: any[] = []
    const line = content.split('\n')
    if (Array.isArray(line)) {
      line.forEach((it: string) => {
        const rows = it.split('\t')
        if (Array.isArray(rows)) {
          if (rows.length === 1) {
            list.push({
              code: rows[0],
              num: null,
            })
          } else if (rows.length >= 2) {
            list.push({
              code: rows[0],
              num: rows[1],
            })
          }
        }
      })
    }
    if (list.length > 0) {
      const map = {}
      list.forEach((it) => {
        if (it.num !== null) {
          map[it.code] = it.num
        }
      })
      request({
        [listValueFiled]: list.map((it) => it.code),
        ...params,
      }).then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          const newList = res.map((it: any) => {
            return {
              ...it,
              quantity: map[it.cargoCode],
            }
          })
          addList?.(newList)
          close()
        } else {
          message.warning('未查询到相关货品，无法添加')
        }
      })
    } else {
      message.warning('格式不正确，无法解析')
    }
  }

  const modalButtons = [
    {
      text: '取消',
      onClick() {
        close()
      },
    },
    {
      text: '确定',
      type: 'primary',
      onClick() {
        form?.validateFields().then((values: any) => {
          formatContent(values.content)
        })
      },
    },
  ]

  return (
    <ModalPageContainer title={title} toolbar={modalButtons}>
      <Form name="basic" form={form} layout="vertical">
        <Form.Item
          required={false}
          label={warning}
          name="content"
          rules={[{ required: true, message: '请粘贴您的数据' }]}
        >
          <TextArea
            autoSize={{
              minRows: 6,
            }}
          />
        </Form.Item>
      </Form>
    </ModalPageContainer>
  )
}

export const openBatchCopyAddModal = (pageProps) => {
  CModal.show({
    title: '批量添加货品',
    width: 800,
    content: BatchCopyAddModal,
    okCancel: false,
    footer: null,
    pageProps: pageProps,
  })
}

export default BatchCopyAddModal
