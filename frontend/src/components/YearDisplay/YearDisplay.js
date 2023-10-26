import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatYear } from 'helpers/time';
import config from 'constants/config';
import './style.css';

const YearDisplay = ({ min, max, className, angle, style, yAngle }) => {
  const { t } = useTranslation();

  let classes = 'year-display';
  if (className) classes += ` ${className}`;

  const styles = useMemo(() => {
    if (!angle) return undefined;

    const transform = yAngle ? `rotate(${angle}deg) rotateY(${yAngle}deg)` : `rotate(${angle}deg)`;

    if (style) return {
      ...style,
      transform,
    };

    return { transform };
  }, [angle, yAngle, style]);

  const range = max - min;
  const current = Math.round(min) + Math.round(range / 100 * config.FOCUS_POINT);

  return (
    <div className={classes} style={styles}>{formatYear(current, t)}</div>
  );
};

export default YearDisplay;
