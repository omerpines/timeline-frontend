import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useLanguage from 'hooks/useLanguage';
import { getLocalized, noop } from 'helpers/util';
import { getPeriodLink } from 'helpers/urls';
import config from 'constants/config';
import './style.css';

const TimelinePeriod = ({ width, data, min, max, onChangePeriod }) => {
  const lang = useLanguage();

  const styles = useMemo(() => {
    const yearCost = width / (max - min);
    const length = data.endDate - data.fromDate + 1;

    const start = Math.ceil((data.fromDate - min) * yearCost);
    return {
      width: Math.ceil(yearCost * length),
      transform: `translateX(${start * -1}px)`,
      backgroundColor: data.color,
    };
  }, [width, data, min, max]);

  const shadowStyles = useMemo(() => {
    const c = data.color;

    return {
      background: `transparent linear-gradient(180deg, ${c}00 0%, ${c}56 100%) 0% 0% no-repeat padding-box`,
    };
  }, [data]);

  const onClick = useCallback(() => {
    onChangePeriod(data.id);
  }, [onChangePeriod, data]);

  const imageStyles = useMemo(() => {
    if (!data.image || !data.image.data) return false;
    return { 
      backgroundImage: `url(${config.API}${data.image.data.attributes.url})`,
    };
  }, [data]);

  return (
    <Link className="timeline__period" style={styles} to={getPeriodLink(data.id)}>
      {getLocalized(data, 'name', lang)}
      {false && imageStyles && <div className="timeline__period-image" style={imageStyles} />}
      <div className="timeline__period-shadow" style={shadowStyles} />
    </Link>
  );
};

export default TimelinePeriod;
