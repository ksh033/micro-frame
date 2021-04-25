import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useInterval, useCounter, useUpdateEffect } from 'ahooks';
import { Button } from 'antd';
import style from './index.less';

const SMSCode: React.ForwardRefRenderFunction<any, any> = (props, ref: any) => {
  const [current, { dec, reset }] = useCounter(60, { min: 1, max: 60 });

  const [interval, setInterval] = useState<any>(null);

  const [started, setStarted] = useState<any>(false);

  useImperativeHandle(ref, () => () => ({
    started,
  }));

  useInterval(
    () => {
      dec();
    },
    interval,
    { immediate: false },
  );

  useUpdateEffect(() => {
    if (current === 1) {
      reset();
      setInterval(null);
      setStarted(false);
    }
  }, [current]);

  const handleClick = () => {
    setInterval(1000);
    setStarted(true);
  };

  if (interval !== null) {
    return (
      <Button type="link" disabled className={style['sms-code-size']}>
        重新获取 {current} s
      </Button>
    );
  } else {
    return (
      <Button type="link" onClick={handleClick} className={style['sms-code-size']}>
        获取验证码
      </Button>
    );
  }
};

export default forwardRef(SMSCode);
