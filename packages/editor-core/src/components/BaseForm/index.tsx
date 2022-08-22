import React, { useContext } from 'react';
import ProProvider from '@ant-design/pro-provider';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
// @ts-ignore
import * as Components from '@scvisual/element';
import { ProRenderFieldPropsType } from '@ant-design/pro-utils';
import { valueTypelist } from '../../index';

const BaseForm: React.FC<FormSchema<any>> = (props) => {
  const rowData = props['data-row'] || {};
  const values = useContext(ProProvider);

  const valueTypeMap: Record<string, ProRenderFieldPropsType> = {};
  valueTypelist.forEach((warpCom) => {
    const cmpkey = warpCom.charAt(0).toUpperCase() + warpCom.substring(1);
    const WarpCommponent = Components[cmpkey];
    // console.log('WarpCommponent', WarpCommponent);
    valueTypeMap[warpCom] = {
      renderFormItem: (text, rprops) => {
        return (
          <WarpCommponent
            {...rprops}
            {...rprops?.fieldProps}
            rowData={rowData}
          />
        );
      },
    };
  });

  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: valueTypeMap,
      }}
    >
      <BetaSchemaForm {...props} layoutType="Form"></BetaSchemaForm>
    </ProProvider.Provider>
  );
};

export default BaseForm;
