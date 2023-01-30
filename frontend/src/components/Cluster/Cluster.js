import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEventLink } from 'helpers/urls';
import './style.css';

const renderPoint = (data, i) => {
  const styles = { backgroundColor: data.color };

  return (
      <span className="dimensional__item-link" style={styles} key={i} />
  );
}

const Cluster = ({ data, onZoom }) => {
  const { t } = useTranslation();

  const onClick = useCallback(() => {
    const dataMin = Math.min(...data.map(dp => dp.fromDate));
    const dataMax = Math.max(...data.map(dp => dp.endDate));

    const adjustment = Math.round((dataMax - dataMin) * 0.1);

    onZoom(dataMin - adjustment, dataMax + adjustment * 3);
  }, [data, onZoom]);

  if (!data.length) return false;

  return (
    <div className="cluster">
      <div className="cluster__body" onClick={onClick}>
        <i className="fa fa-search-plus cluster__zoom-icon" />
        <div className="cluster__zoom-text">{t('cluster.zoom')}</div>
        <ul className="cluster__points">
          {data.slice(0, 4).map(renderPoint)}
        </ul>
        {data.length > 4 && (
          <div className="cluster__more">
            {'+'}
            {data.length - 4}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cluster;
