import { useState, useEffect } from 'react';
import config from 'constants/config';

const useMobile = () => {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const onZoom = () => {
      const width = window.innerWidth;
      if (width <= config.MOBILE_BREAK_POINT) setMobile(true);
      else setMobile(false);
    };

    window.addEventListener('resize', onZoom);

    return () => window.removeEventListener('resize', onZoom);
  }, []);

  return isMobile;
};

export default useMobile;
