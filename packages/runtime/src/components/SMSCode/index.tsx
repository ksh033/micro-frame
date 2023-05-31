import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useInterval, useCounter, useUpdateEffect, useRequest } from "ahooks";
import { Button } from "antd";
import style from "./index.less";

const SMSCode: React.ForwardRefRenderFunction<
  {
    request?: (params: any) => Promise<any>; // 请求数据的远程方法
  },
  any
> = (props, ref: any) => {
  const [current, { dec, reset }] = useCounter(60, { min: 1, max: 60 });

  const [interval, setInterval] = useState<any>(null);

  const [started, setStarted] = useState<any>(false);

  const { loading, run } = useRequest(
    props.request ||
      new Promise((resolve) => {
        resolve(null);
      }),
    {
      manual: true,
    }
  );

  useImperativeHandle(ref, () => () => ({
    started,
  }));

  useInterval(
    () => {
      dec();
    },
    interval,
    { immediate: false }
  );

  useUpdateEffect(() => {
    if (current === 1) {
      reset();
      setInterval(null);
      setStarted(false);
    }
  }, [current]);

  const handleClick = () => {
    run({
      phone: props?.phone,
    }).then(() => {
      setInterval(1000);
      setStarted(true);
    });
  };

  const btndisabled = props?.phone == null || props?.phone === "";

  if (interval !== null) {
    return (
      <Button type="link" disabled className={style["sms-code-size"]}>
        重新获取 {current} s
      </Button>
    );
  } else {
    return (
      <Button
        type="link"
        onClick={handleClick}
        className={
          btndisabled ? style["sms-code-size-disable"] : style["sms-code-size"]
        }
        loading={loading}
        disabled={btndisabled}
      >
        获取验证码
      </Button>
    );
  }
};

export default forwardRef(SMSCode);
