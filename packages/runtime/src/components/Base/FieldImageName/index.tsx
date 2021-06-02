import React from 'react'
import styles from './index.less'
import BsImg from '../BsImg'
import { BsTableComponentProps } from '../BsTable'

type FieldImageNameProps = BsTableComponentProps & {
  fieldName: string
  fieldImage: string
}

const FieldImageName: React.FC<FieldImageNameProps> = (props) => {
  const { fieldImage, fieldName, rowData } = props
  return (
    <div className={styles['bg-field-line']}>
      <div className={styles['bg-field-image']}>
        <BsImg src={rowData[fieldImage]}></BsImg>
      </div>
      <div className={styles['bg-field-value']}>{rowData[fieldName]}</div>
    </div>
  )
}

export default FieldImageName
