//@ts-nocheck
//import { Button } from 'antd'

import Button,{ ButtonProps } from 'antd/es/button'
import Authority from '../Authority'

export default Authority<ButtonProps & React.RefAttributes<HTMLElement>>(Button)
