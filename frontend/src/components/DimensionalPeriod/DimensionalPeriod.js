import React, { useMemo } from 'react';
import config from 'constants/config';
import { restrictedFromRange } from 'helpers/util';
import './style.css';

const DimensionalPeriod = ({ data, min, range}) => {
  const style = useMemo(() => {
    const { fromDate, endDate } = data;
    const distanceInYears = range / 100 * config.PERIOD_TRANSITION_RANGE;
    const focusYear = min + range / 100 * config.FOCUS_POINT;

    let opacity = 1;
    if (focusYear - distanceInYears < fromDate) {
      opacity = restrictedFromRange(fromDate - distanceInYears, fromDate + distanceInYears, focusYear);
    } else if (focusYear +distanceInYears > endDate) {
      opacity = 1 - restrictedFromRange(endDate - distanceInYears, endDate + distanceInYears, focusYear);
    }

    return {
      opacity,
      backgroundImage: data.image && data.image.data ? `url(${config.API}${data.image.data.attributes.url})` : 'none',
    };
  }, [min, range, data]);

  return (
    <div className="dimensional-period" style={style} />
  );
};

export default DimensionalPeriod;
