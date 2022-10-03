import React from 'react';
import { useTranslation } from 'react-i18next';
import './style.css';

const TimelineLegend = ({ className }) => {
  const { t } = useTranslation();

  let classes = 'timeline-legend';
  if (className) classes += ` ${className}`;

  return (
    <ul className={classes}>
      <li className="timeline-legend__point timeline-legend__point--characters">{t('legend.characters')}</li>
      <li className="timeline-legend__point timeline-legend__point--stories">{t('legend.stories')}</li>
      <li className="timeline-legend__point timeline-legend__point--books">{t('legend.books')}</li>
      <li className="timeline-legend__point timeline-legend__point--periods">{t('legend.periods')}</li>
    </ul>
  );
};

export default TimelineLegend;
