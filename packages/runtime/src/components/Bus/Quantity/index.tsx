import type {
  TableComponent,
  TableComponentProps,
} from '@scboson/sc-element/es/sc-editable-table/typing';
import React, { useMemo } from 'react';
import BsNumberInput from '../../Base/BsNumberInput';
import useWeightUnit from '../../Dict/weightUnit';

interface QuantityProps extends TableComponentProps {
  onChange?: (val: any) => any;
  value?: any;
  unitName?: string;
  getMax?: (record: any) => number;
  getMin?: (record: any) => number;
  getSuffix?: (record: any) => React.ReactNode;
  promptRender?: (value: any, record: any) => React.ReactNode;
  style?: any;
  id?: any;
  disabled?: boolean | ((record: any) => boolean);
  getComplement?: (complement: number, record: any) => number;
}

const Quantity: TableComponent<QuantityProps> = (props) => {
  const {
    rowData: proRowData,
    value,
    onChange,
    getMax,
    getMin,
    getSuffix,
    unitName = 'cargoUnit',
    promptRender,
    form,
    disabled = false,
    getComplement,
    ...resProps
  } = props;

  const { weightUnit, has } = useWeightUnit();

  const rowData = props.rowData || props['data-row'] || {};

  const max = getMax?.(rowData) || undefined;

  const min = getMin?.(rowData) || undefined;

  const newDisabled =
    typeof disabled === 'function' ? disabled?.(rowData) : disabled;

  const IsWeightUnit = useMemo(() => {
    return has(rowData[unitName]);
  }, [unitName, JSON.stringify(rowData)]);

  const complement = useMemo(() => {
    let newComplement = 0;
    if (IsWeightUnit) {
      newComplement = 3;
    }
    if (getComplement) {
      newComplement = getComplement(newComplement, rowData);
    }
    return newComplement;
  }, [IsWeightUnit]);

  return (
    <>
      <BsNumberInput
        value={value !== undefined && value !== null ? String(value) : value}
        onChange={onChange}
        suffix={getSuffix?.(rowData)}
        complement={complement}
        max={max}
        min={min}
        disabled={newDisabled}
        {...resProps}
      />
      {promptRender ? promptRender(value, rowData) : null}
    </>
  );
};
Quantity.customView = true;

export default Quantity;
