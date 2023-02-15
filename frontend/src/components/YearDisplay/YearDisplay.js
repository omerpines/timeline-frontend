import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatYear } from 'helpers/time';
import config from 'constants/config';
import './style.css';

const YearDisplay = ({ min, max, className }) => {
  const { t } = useTranslation();

  let classes = 'year-display';
  if (className) classes += ` ${className}`;

  const range = max - min;
  const current = Math.round(min) + Math.round(range / 100 * config.FOCUS_POINT);

  return (
    <div className={classes}>{formatYear(current, t)}</div>
  );
};

export default YearDisplay;
