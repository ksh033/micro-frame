/* eslint-disable global-require */
import React, { FC, useLayoutEffect, useMemo, useState } from 'react'
import { CForm } from '@scboson/sc-element'
import { EditPage, useEditPageContext } from '@scboson/sc-schema'
import { PageContainer } from '@micro-frame/sc-runtime'
import { getService } from '@/utils/api'
import { Auth } from '@micro-frame/sc-runtime'
import SysPermList from './components/SysPermList'
import formData from './components/form'

const services = getService(
  'role',
  'listsys',
  'listDept',
  'formSubmit',
  'queryById',
  'formUpdate'
)
const pagaConfig = {
  service: services,
  pageType: 'page',
  ...formData,
}

const Page: FC<any> = (props) => {
  const scope = useEditPageContext()
  // scope.setData({ list: [] })
  const action = scope.getAction()

  const [systemCode, setSystemCode] = useState<string | null | undefined>(
    Auth.getUser()?.userAppInfo.currentSystem.systemCode
  )
  const [bizDeptId, setBizDeptId] = useState<string | null | undefined>(
    Auth.getUser()?.userAppInfo.currentDept.bizDeptId
  )
  const superAdminFlag = Auth.getUser()?.superAdminFlag

  const initialValues = useMemo(() => {
    return {
      systemCode: systemCode,
      bizDeptId: bizDeptId,
      roleType: 'COMMON',
    }
  }, [systemCode, bizDeptId, superAdminFlag])

  useLayoutEffect(() => {
    scope.toInitialValues({ key: 'roleId', defaultValues: initialValues })
  }, [])

  const bizDeptIdParam = useMemo(() => {
    return { systemCode: systemCode }
  }, [systemCode])

  const formConfig = scope
    .getFormInfo()
    .changeFormItem('roleType', {
      props: {
        disabled: true,
      },
    })
    .changeFormItem('sysPermList', {
      component: SysPermList,
      props: {
        systemCode: systemCode,
        bizDeptId: bizDeptId,
      },
    })
    .changeFormItem('bizDeptId', {
      props: {
        params: bizDeptIdParam,
      },
    })
    .toConfig()
  const modalButtons = scope.getModalBtns(action, true)
  const title = scope.getTitle(action)

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
    <PageContainer title={`角色${title}`} footer={modalButtons}>
      <CForm
        {...formConfig}
        layout="vertical"
        action={action}
        anchor={false}
        onValuesChange={onValuesChange}
      />
    </PageContainer>
  )
}
export default EditPage(Page, pagaConfig)
