/* eslint-disable global-require */
import React, { useLayoutEffect, FC } from 'react';
import { CForm } from '@scboson/sc-element';
import {EditPage,useEditPageContext }from '@scboson/sc-schema';
import {ModalPageContainer} from '@micro-frame/sc-runtime';
import {getService} from '@/utils/api';

import formData from './components/form';


const services=getService("deptUser","formSubmit",'detail','formSubmit')

const pagaConfig = {
  service: services,
  pageType:'modalpage',
  ...formData,
};

const Page: FC<any> = props => {
  const scope=useEditPageContext();
  const action = scope.getAction();
 // const pageParam = scope.getPageParam();


  const formConfig= scope.getFormInfo().toConfig()
  const modalButtons = scope.getModalBtns(action, true);
  const title = scope.getTitle(action);

  useLayoutEffect(() => {

  }, []);

  return (
    <ModalPageContainer title={title} toolbar={modalButtons}>
      <CForm  {...formConfig} action={action} anchor={false} />
    </ModalPageContainer>
  );
};
export default EditPage(Page, pagaConfig);
