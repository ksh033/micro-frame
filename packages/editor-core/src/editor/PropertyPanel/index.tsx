import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { useStore } from '../../stores';
import { ModalType } from '../../stores/editor';
import './index.less';
import PanelList from './PanelList';
import BaseForm from '../../components/BaseForm';
import { filterPageConfig } from '../../utils/common';

const PropertyPanel: React.FC<any> = (props) => {
  const { editorStore, comsStore } = useStore();

  const modalType = editorStore.modalType;

  const editCmp =
    modalType === 'pageSet' ? editorStore.pageinfo : editorStore.currentEditCmp;

  const [form] = Form.useForm();

  const [values, setValues] = useState<any>(editCmp?.getFieldsValue() || {});
  const initialValues = editCmp?.getInitialValue
    ? editCmp?.getFieldsValue()
    : {};
  const editCmpInfo = comsStore.getCompInfoByKey(editCmp?.cmpKey || '');

  useEffect(() => {
    const newValues = editCmp?.getFieldsValue() || {};
    setValues(newValues);
    form.setFieldsValue(newValues);
  }, [editCmp?.id]);

  // 判读是否一进来就校验
  useEffect(() => {
    form.validateFields();
    editCmp?.setImmediatelyCheck(false);
  }, [Boolean(editCmp?.immediatelyCheck)]);

  const columns = React.useMemo(() => {
    if (editCmp?.propsConfig) {
      let newcolumns = filterPageConfig(editCmp?.propsConfig);
      if (editCmp?.getPropsConfig) {
        newcolumns = editCmp?.getPropsConfig(newcolumns, values);
      }
      return newcolumns;
    }
    return [];
  }, [editCmp?.propsConfig, editCmp?.getPropsConfig, JSON.stringify(values)]);

  const onPageValuesChange = (values: any, allValues: any) => {
    // 更新页面数据
    editorStore.updatePageInfoValues(allValues);
  };

  const onValuesChange = (values: any, allValues: any) => {
    let newValues = { ...initialValues, ...allValues };
    // 修改表单
    if (editCmp?.onValuesChange) {
      newValues = editCmp?.onValuesChange(values, newValues);
      form.setFieldsValue(newValues);
    }
    console.log(newValues);
    setValues(newValues);
    if (editCmp?.formatValues) {
      editorStore.updateCurrentEditCmpValues(editCmp?.formatValues(newValues));
    } else {
      editorStore.updateCurrentEditCmpValues(newValues);
    }
    // 更新数据
  };

  const renderByType = (type: ModalType) => {
    if ((type === 'component' || type === 'pageSet') && editCmp) {
      const formProps = editCmp.formProps || {};

      const baseProps = {
        id: editCmp.id,
        form: form,
        columns: columns,
        submitter: false,
        initialValues: initialValues,
        onValuesChange:
          type === 'component' ? onValuesChange : onPageValuesChange,
        'data-row': values,
        ...formProps,
      };

      if (editCmp.render) {
        return <React.Fragment>{editCmp.render(baseProps)}</React.Fragment>;
      }

      return <BaseForm {...baseProps}></BaseForm>;
    }
    if (type === 'componentList') {
      return <PanelList></PanelList>;
    }
    return null;
  };

  return (
    <div className="right-wrapper">
      <div className="deco-editor-wrap">
        <div className="deco-component-title">
          <div className="deco-component-title__header">
            <span className="deco-component-title__name">
              {editCmpInfo ? editCmpInfo.name : '组件管理'}
            </span>
          </div>
          {editCmpInfo && editCmpInfo?.description ? (
            <div className="deco-component-title__msg">
              {editCmpInfo?.description}
            </div>
          ) : null}
        </div>
        <div className="deco-component-form">{renderByType(modalType)}</div>
      </div>
    </div>
  );
};
export default observer(PropertyPanel);
