import { useStore } from '../../stores';
import { Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ComponentSchemaProps } from '@scvisual/element';
import { filterPageConfig } from '../../utils/common';
import { validateRules } from '../../utils/validateUtil';
const PropertyPanel: React.FC<any> = (props) => {
  const { editorStore } = useStore();

  const editList = editorStore.editList;
  const handleClick = async () => {
    let flag = true;
    if (Array.isArray(editList)) {
      for (let i = 0; i < editList.length; i++) {
        const item: ComponentSchemaProps = editList[i];
        let newcolumns = filterPageConfig(item?.propsConfig);
        if (item?.getPropsConfig) {
          newcolumns = item?.getPropsConfig(newcolumns, item.values);
        }
        const itemFlag = await validateRules(newcolumns, item.values);
        if (flag && itemFlag === false) {
          flag = false;
          editorStore.updeteEditListItem({
            ...item,
            immediatelyCheck: true,
          });
          editorStore.switchEditCmp(item.id);
          break;
        }
      }
    }
    if (flag) {
      message.success('保存成功');
    }
  };

  return (
    <div className="top-bar">
      <div>微页面</div>
      <div>
        <Button type="primary" onClick={handleClick}>
          保存
        </Button>
      </div>
    </div>
  );
};
export default observer(PropertyPanel);
