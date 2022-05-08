import React, { useMemo } from 'react';
import config from 'constants/config';
import { easeShare } from 'helpers/util';
import './style.css';

const DimensionalPeriod = ({ data, min, range}) => {
  const style = useMemo(() => {
    const { fromDate, endDate } = data;
    const startPosition = easeShare(1 - (fromDate - min) / range);
    const endPosition = easeShare(1 - (endDate - min) / range);
    const width = Math.abs((endPosition - startPosition) * 100);
    const shift = endPosition * 100;

    return {
      left: `${shift}%`,
      width: `${width}%`,
      backgroundImage: data.image && data.image.data ? `url(${config.API}${data.image.data.attributes.url})` : 'none',
    };
  }, [min, range, data]);

  return (
    <div className="dimensional-period" style={style} />
  );
};

export default DimensionalPeriod;
