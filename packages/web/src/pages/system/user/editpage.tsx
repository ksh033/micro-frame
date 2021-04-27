/* eslint-disable global-require */
import React, { useLayoutEffect, FC, useState } from 'react'
import { CForm } from '@scboson/sc-element'
import { EditPage, useEditPageContext } from '@scboson/sc-schema'
import { ModalPageContainer, getService } from '@micro-frame/sc-runtime'
import { Auth } from '@micro-frame/sc-runtime'

import formData from './components/form'

const services = getService(
  'deptUser',
  'formSubmit',
  'detail',
  'formSubmit',
  'querySysList',
  'queryDeptList'
)

const roleServices = getService('role', 'listsys', 'listDept', 'listDeptRole')

const pagaConfig = {
  service: { ...services, ...roleServices },
  pageType: 'modalpage',
  ...formData,
}
interface UserEditState {
  systemCode: string

  bizDeptId: string
}

const Page: FC<any> = (props) => {
  const scope = useEditPageContext<UserEditState>()
  const action = scope.getAction()

  const [systemCode, setSystemCode] = useState<string | null | undefined>(
    Auth.getUser()?.userAppInfo.currentSystem.systemCode
  )
  const [bizDeptId, setBizDeptId] = useState<string | null | undefined>(
    Auth.getUser()?.userAppInfo.currentDept.bizDeptId
  )
  const pageLoad = async () => {
    const record = {
      systemCode,
      bizDeptId,
    }
    scope.toInitialValues({ defaultValues: record })
  }

  const formConfig = scope
    .getFormInfo()
    .changeFormItem('bizDeptId', {
      props: {
        params: { systemCode: systemCode },
      },
    })
    .changeFormItem('sysRoleList', {
      props: {
        params: {
          systemCode: systemCode,
          bizDeptId: bizDeptId,
        },
      },
    })
    .toConfig()
  const modalButtons = scope.getModalBtns(action, true)
  const title = scope.getTitle(action)

  useLayoutEffect(() => {
    pageLoad()
  }, [])

  const onValuesChange = (changedValues: any, values: any) => {
    if (values['systemCode'] !== systemCode) {
      formConfig.form.current.setFieldsValue({
        bizDeptId: null,
      })
      setBizDeptId(null)
      setSystemCode(values['systemCode'])
    }
    if (values['bizDeptId'] !== bizDeptId) {
      setBizDeptId(values['bizDeptId'])
    }
  }

  return (
    <ModalPageContainer title={title} toolbar={modalButtons}>
      <CForm
        {...formConfig}
        layout="vertical"
        action={action}
        anchor={false}
        onValuesChange={onValuesChange}
      />
    </ModalPageContainer>
  )
}

export default EditPage(Page, pagaConfig)
