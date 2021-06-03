/* eslint-disable global-require */
import React, { useLayoutEffect, FC } from 'react'
import { CForm } from '@scboson/sc-element'
import { EditPage, useEditPageContext } from '@scboson/sc-schema'
import { useServiceRequest } from '@micro-frame/sc-runtime'
import { Auth } from '@micro-frame/sc-runtime'
import formData from './components/form'
import { useSetState } from 'ahooks'
import { User } from '@micro-frame/sc-runtime/es/components/Auth'
import { Button } from 'antd'
import styles from './baseStyles.less'

const pagaConfig = {
  service: {},
  pageType: 'modalpage',
  ...formData,
}
interface CurrentUserState {}

const Page: FC<any> = (props) => {
  const scope = useEditPageContext<CurrentUserState>()
  const { run } = useServiceRequest('user', 'update')
  const user: User | null = Auth.getUser()
  const [userInfo, setUseInfo] = useSetState<any>(user)
  const formConfig = scope.getFormInfo().toConfig()

  useLayoutEffect(() => {
    scope.toInitialValues({
      defaultValues: userInfo,
    })
  }, [userInfo])

  const handleSave = () => {
    formConfig.form.current.validateFields().then(async (values: any) => {
      const data = await run(values)
      if (data) {
        setUseInfo(values)
        console.log(values)
        formConfig.form.current.setFieldsValue(values)
        Auth.setUser({ ...userInfo, ...values })
      }
    })
  }

  return (
    <div className={styles['user-current-base']}>
      <CForm {...formConfig} layout="vertical" action="edit" anchor={false} />
      <Button type="primary" onClick={handleSave}>
        更新基础信息
      </Button>
    </div>
  )
}

export default EditPage(Page, pagaConfig)
