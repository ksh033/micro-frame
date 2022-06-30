import { useSessionStorageState } from 'ahooks';
import { uesRequest } from '../../utils/api';

export type LocationareaItem = {
  locationAreaName: string;
  locationAreaId: string;
};

export default function userLocation() {
  const [locationareaList, setLocationareaList] = useSessionStorageState<
    Array<LocationareaItem>
  >('CG-LOCATIONAREA', []);

  const { run } = uesRequest('system', 'locationAreaList');

  const loadLocationarae = async () => {
    const result = await run();
    if (Array.isArray(result)) {
      setLocationareaList(result);
    }
  };

  const getLocationaraeMap = () => {
    const map = new Map<string, string>();
    if (Array.isArray(locationareaList)) {
      locationareaList.forEach((it) => {
        map.set(it.locationAreaId, it.locationAreaName);
      });
    }
    return map;
  };

  return {
    locationareaList,
    loadLocationarae,
    getLocationaraeMap,
    request: run,
  };
}
