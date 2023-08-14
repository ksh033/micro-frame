import { Input, Progress } from 'antd'
import React, { useState } from 'react'
import style from './index.less'
import { chenkPwdStrength } from './check'
import { useThrottleEffect } from 'ahooks'

export { chenkPwdStrength }

const PasswordStrength: React.FC<any> = (props) => {
  const [percent, setPercent] = useState<number>(0)
  useThrottleEffect(
    () => {
      console.log(chenkPwdStrength(props.value))
      setPercent(chenkPwdStrength(props.value))
    },
    [props.value],
    {
      wait: 500,
    }
  )

  const showName = () => {
    if (percent < 50 && percent >= 0) {
      return '弱'
    } else if (percent < 60 && percent >= 50) {
      return '中'
    } else {
      return '强'
    }
  }

  return (
    <div>
      <Input {...props} type="password"></Input>
      <div className={style['password-progress']}>
        <div className={style['strength']}>密码强度：</div>
        <div className={style['progree']}>
          <Progress
            type="line"
            percent={percent}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
        <div className={style['name']}>{showName()}</div>
      </div>
    </div>
  )
}
export default PasswordStrength
