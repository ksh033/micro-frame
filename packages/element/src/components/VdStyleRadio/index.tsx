import { Input, Radio, RadioChangeEvent, RadioGroupProps, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import React, { useEffect, useMemo, useState } from 'react';

export interface VdCheckboxOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  showBtn?: boolean;
  btnText?: string;
}

type VdStyleRadioProps = Omit<RadioGroupProps, 'options' | 'onChange'> & {
  options?: Array<VdCheckboxOptionType>;
  onChange?: (val: any) => void;
};

const VdStyleRadio: React.FC<VdStyleRadioProps> = (props) => {
  const {
    value = {
      btn_type: 1,
      btn_text: '',
    },
    onChange,
  } = props;

  const [showBtn, setShowBtn] = useState<boolean>(false);

  const radioOnchange = (e: RadioChangeEvent) => {
    onChange?.({
      btn_type: e.target.value,
      btn_text: value.btn_text,
    });
  };

  useEffect(() => {
    const options = Array.isArray(props.options) ? props.options : [];
    const item = options.find((it) => it.value === value.btn_type);
    if (item) {
      setShowBtn(Boolean(item.showBtn));
      onChange?.({
        btn_type: value.btn_type,
        btn_text: item.btnText,
      });
    } else {
      setShowBtn(false);
    }
  }, [JSON.stringify(props.options), value.btn_type]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      btn_type: value.btn_type,
      btn_text: e.target.value,
    });
  };

  return (
    <Space direction="vertical" size={20}>
      <Radio.Group
        options={props.options}
        onChange={radioOnchange}
        value={value.btn_type}
      />
      {showBtn ? (
        <Input
          value={value.btn_text}
          onChange={onInputChange}
          style={{ width: '80px' }}
        ></Input>
      ) : null}
    </Space>
  );
};

export default VdStyleRadio;
