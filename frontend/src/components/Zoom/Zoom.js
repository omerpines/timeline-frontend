import './style.css';

import React, { useCallback, useMemo } from 'react';

import config from 'constants/config';
import useMobile from 'hooks/useMobile';

const percentCost = config.INITIAL_RANGE / 100;
const zoomDiff = config.INITIAL_RANGE / 200 * config.ZOOM_INCREMENT;

const minDesktopRange = Math.round(config.INITIAL_RANGE * config.MIN_DESKTOP_ZOOM / 100);
const maxDesktopRange = Math.round(config.INITIAL_RANGE * config.MAX_DESKTOP_ZOOM / 100);
const minMobileRange = Math.round(config.INITIAL_RANGE * config.MIN_MOBILE_ZOOM / 100);
const maxMobileRange = Math.round(config.INITIAL_RANGE * config.MAX_MOBILE_ZOOM / 100);

const Zoom = ({ range, min, max, zoomTo }) => {
  const isMobile = useMobile();

  const displayValue = useMemo(() => {
    const percents = Math.round(range / percentCost);
    return `${percents}%`;
  }, [range]);

  const inc = useCallback(() => {
    const maxRange = isMobile ? maxMobileRange : maxDesktopRange;
    const newMin = min - zoomDiff;
    const newMax = max + zoomDiff;
    const newRange = newMax - newMin;
    if (newRange > maxRange) {
      const fix = (maxRange - (max - min)) / 2;
      zoomTo(Math.floor(min - fix), Math.ceil(max + fix));
    }
    else zoomTo(newMin, newMax);
  }, [min, max, zoomTo, isMobile]);

  const dec = useCallback(() => {
    const minRange = isMobile ? minMobileRange : minDesktopRange;
    const newMin = min + zoomDiff;
    const newMax = max - zoomDiff;
    const newRange = newMax - newMin;
    if (newRange < minRange) {
      const fix = (max - min - minRange) / 2;
      zoomTo(Math.ceil(min + fix), Math.floor(max - fix));
    }
    else zoomTo(newMin, newMax);
  }, [min, max, zoomTo, isMobile]);

  return (
    <div className="zoom">
      <div className="zoom__button zoom__button--inc" onClick={inc}>+</div>
      <div className="zoom__button zoom__button--dec" onClick={dec}>–</div>
      <div className="zoom__value">{displayValue}</div>
    </div>
  );
};

export default Zoom;
