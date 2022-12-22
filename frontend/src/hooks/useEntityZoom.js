import { useEffect } from 'react';
import config from 'constants/config';

const useEntityZoom = (entity, zoomTo, min, max) => {
  useEffect(() => {
    const clsMin = min;
    const clsMax = max;
    const range = max - min;
    const percent = Math.round(range / 100);

    if (!entity || !entity.endDate) return;

    const newDate = entity.endDate;
    const newMin = newDate - config.FOCUS_POINT * percent;
    const newMax = newDate + (100 - config.FOCUS_POINT) * percent;
    console.log(newMin, newMax);

    zoomTo(newMin, newMax);

    return () => {
      zoomTo(clsMin, clsMax);
    };
  }, [entity]);
};

export default useEntityZoom;
