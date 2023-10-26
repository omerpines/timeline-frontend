import { useEffect } from 'react';
import config from 'constants/config';

const useEntityZoom = (entity, zoomTo, min, max) => {

  useEffect(() => {
    const clsMin = min;
    const clsMax = max;
    const range = max - min;
    const percent = range / 100;

    if (!entity || !entity.fromDate) return;

    const newDate = entity.fromDate;
    const newMin = newDate - config.FOCUS_POINT * percent;
    const newMax = newDate + (100 - config.FOCUS_POINT) * percent;

    zoomTo(newMin, newMax);

    return () => {
      zoomTo(clsMin, clsMax);
    };
  }, [entity]);
};

export default useEntityZoom;
