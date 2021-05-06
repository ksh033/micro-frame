import React from 'react'
import styles from './index.less'
import BsImg from '../BsImg'

type FieldImageNameProps = {
  fieldName: string
  fieldImage: string
}

const FieldImageName: React.FC<FieldImageNameProps> = (props) => {
  const { fieldImage, fieldName } = props
  return (
    <div className={styles['bg-field-line']}>
      <div className={styles['bg-field-image']}>
        <BsImg src={fieldImage}></BsImg>
      </div>
      <div>{fieldName}</div>
    </div>
  )
}

export default FieldImageName
