import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import Authority from '../Authority';

export default Authority<ButtonProps & React.RefAttributes<HTMLElement>>(Button);
