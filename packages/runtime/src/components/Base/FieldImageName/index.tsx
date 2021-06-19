import React from 'react'
import styles from './index.less'
import BsImg from '../BsImg'
import { BsTableComponentProps } from '../BsTable'

type FieldImageNameProps = BsTableComponentProps & {
  fieldName: string
  fieldImage: string
  fildDesc?: string
}

const FieldImageName: React.FC<FieldImageNameProps> = (props) => {
  const { fieldImage, fieldName, rowData, fildDesc } = props
  return (
    <div className={styles['bg-field-line']}>
      <div className={styles['bg-field-image']}>
        <BsImg src={rowData[fieldImage]}></BsImg>
      </div>
      <div className={styles['bg-field-value']}>
        <span>{rowData[fieldName]}</span>
        {fildDesc ? (
          <span className={styles['bg-field-desc']}>{fildDesc}</span>
        ) : null}
      </div>
    </div>
  )
}

export default FieldImageName
