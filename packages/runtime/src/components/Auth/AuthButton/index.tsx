import { Button } from 'antd'
import { ButtonProps } from 'antd/es/button'
import Authority from '../Authority'

export default Authority<ButtonProps & React.RefAttributes<HTMLElement>>(Button)
