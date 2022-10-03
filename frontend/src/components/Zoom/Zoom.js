import React, { useMemo, useCallback } from 'react';
import config from 'constants/config';
import './style.css';

const percentCost = config.INITIAL_RANGE / 100;
const zoomDiff = config.INITIAL_RANGE / 200 * config.ZOOM_INCREMENT;

const Zoom = ({ range, min, max, zoomTo }) => {
  const displayValue = useMemo(() => {
    const percents = Math.round(range / percentCost);
    return `${percents}%`;
  }, [range]);

  const inc = useCallback(() => {
    zoomTo(min - zoomDiff, max + zoomDiff);
  }, [min, max, zoomTo]);

  const dec = useCallback(() => {
    zoomTo(min + zoomDiff, max - zoomDiff);
  }, [min, max, zoomTo]);

  return (
    <div className="zoom">
      <div className="zoom__button zoom__button--inc" onClick={inc}>+</div>
      <div className="zoom__button zoom__button--dec" onClick={dec}>–</div>
      <div className="zoom__value">{displayValue}</div>
    </div>
  );
};

export default Zoom;
