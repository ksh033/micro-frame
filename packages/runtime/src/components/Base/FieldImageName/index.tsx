import React from "react";
import styles from "./index.less";
import BsImg from "../BsImg";
import { BsTableComponentProps } from "../BsTable";

type FieldImageNameProps = BsTableComponentProps & {
  fieldName: string;
  fieldImage: string;
  fildDesc?: string | React.ReactNode;
  onClick?: (record: any) => {};
};

const FieldImageName: React.FC<FieldImageNameProps> = (props) => {
  const { fieldImage, fieldName, rowData, fildDesc, onClick } = props;
  return (
    <div
      className={`${styles["bg-field-line"]} ${onClick ? "bg-field-link" : ""}`}
    >
      <div className={styles["bg-field-image"]}>
        <BsImg src={rowData[fieldImage]}></BsImg>
      </div>
      <div className={styles["bg-field-value"]}>
        <span
          onClick={() => {
            onClick && onClick(rowData);
          }}
        >
          {rowData[fieldName]}
        </span>
        {fildDesc ? (
          <span
            onClick={() => {
              onClick && onClick(rowData);
            }}
            className={styles["bg-field-desc"]}
          >
            {fildDesc}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default FieldImageName;
