import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatYear } from 'helpers/time';
import './style.css';

const YearDisplay = ({ current, className }) => {
  const { t } = useTranslation();

  let classes = 'year-display';
  if (className) classes += ` ${className}`;

  return (
    <div className={classes}>{formatYear(current, t)}</div>
  );
};

export default YearDisplay;
