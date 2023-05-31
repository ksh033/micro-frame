import { uesRequest } from "../../utils/api";
import { useCallback, useMemo } from "react";
import { useSessionStorageState } from "ahooks";

export type WeightDataItem = {
  convertedQuantity: number;
  unitName: string;
  unitValue: string;
  weightUnit: boolean;
};

export default function useWeightUnit() {
  const [weightUnit, setWeightUnit] = useSessionStorageState<
    Array<WeightDataItem>
  >("CG-WEIGHT-UNIT", []);

  const { run } = uesRequest("system", "getWeightUnit");

  const loadWeight = useCallback(async () => {
    if (weightUnit == null || JSON.stringify(weightUnit) === "[]") {
      const result = await run();
      if (Array.isArray(result)) {
        setWeightUnit(result);
      }
    }
  }, [JSON.stringify(weightUnit)]);

  const has = (unitName: string) => {
    const list = weightUnit || [];
    const index = list.findIndex((it) => {
      return it.unitValue === unitName || it.unitName === unitName;
    });
    return index !== -1;
  };

  return { weightUnit, loadWeight, has };
}
