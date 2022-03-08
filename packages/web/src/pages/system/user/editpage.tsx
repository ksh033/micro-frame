/* eslint-disable global-require */
import React, { useLayoutEffect, FC, useState, useMemo } from 'react'
import { CForm } from '@scboson/sc-element'
import { EditPage, useEditPageContext } from '@scboson/sc-schema'
import { ModalPageContainer, getService } from '@micro-frame/sc-runtime'

import formData from './components/form'

const services = getService(
  'deptUser',
  'formSubmit',
  'detail',
  'formUpdate',
  'querySysList',
  'queryDeptList',
  'queryById'
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

  const [systemCode, setSystemCode] = useState<string | null | undefined>()
  const [bizDeptId, setBizDeptId] = useState<string | null | undefined>()
  const initialValues = useMemo(() => {
    return {
      systemCode: systemCode,
      bizDeptId: bizDeptId,
    }
  }, [systemCode, bizDeptId])

  const pageLoad = async () => {
    scope.toInitialValues({
      defaultValues: initialValues,
      callback: (res: any) => {
        setSystemCode(res['systemCode'])
        return {
          ...res,
          sysRoleList: res.sysRoleList?.map((item: any) => {
            return { value: item.roleId, name: item.roleName, key: item.roleId }
          }),
        }
      },
    })
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
        params: initialValues,
      },
    })
    .toConfig()
  const modalButtons = scope.getModalBtns(action, {
    preHandle: (values: any) => {
      console.log(values)
      return {
        ...values,
        sysRoleList: values.sysRoleList?.map((item: any) => item.value),
      }
    },
  })
  const title = scope.getTitle(action)

  useLayoutEffect(() => {
    pageLoad()
  }, [])

  const onValuesChange = (changedValues: any, values: any) => {
    if (!Object.is(values['systemCode'], systemCode)) {
      formConfig.form.current?.setFieldsValue({
        bizDeptId: '',
        sysRoleList: [],
      })
      setBizDeptId('')
      setSystemCode(values['systemCode'])
    }
    if (!Object.is(values['bizDeptId'], bizDeptId)) {
      formConfig.form.current?.setFieldsValue({
        sysRoleList: [],
      })
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
