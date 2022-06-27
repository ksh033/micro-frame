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

  return { locationareaList, loadLocationarae };
}
