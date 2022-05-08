import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import AdminInput from 'components/AdminInput';
import AdminCheckbox from 'components/AdminCheckbox';
import { inRange } from 'helpers/util';
import { renderYear, parseYear, swapBeforeAfter, isBC } from 'helpers/time';
import config from 'constants/config';
import './style.css';

const AdminDateInput = ({ onChange, state, fromOnly }) => {
  const { t } = useTranslation();

  const onStartChange = useCallback(e => {
    const value = parseInt(e.currentTarget.value, 10);
    let newVal = inRange(
      config.MIN_INPUT_YEAR,
      config.MAX_INPUT_YEAR,
      parseYear(value, isBC(state.fromDate))
    );
    onChange('fromDate', newVal);
  }, [onChange, state.endDate, state.fromDate]);

  const onEndChange = useCallback(e => {
    const value = parseInt(e.currentTarget.value, 10);
    let newVal = inRange(
      config.MIN_INPUT_YEAR,
      config.MAX_INPUT_YEAR,
      parseYear(value, isBC(state.endDate))
    );
    onChange('endDate', newVal);
  }, [onChange, state.fromDate, state.endDate]);

  const onShowChange = useCallback(() => {
    onChange('showTimeOnSite', !state.showTimeOnSite);
  }, [onChange, state.showTimeOnSite]);

  const onSwapStart = useCallback(() => {
    onChange('fromDate', swapBeforeAfter(state.fromDate)); 
  }, [onChange, state.fromDate]);

  const onSwapEnd = useCallback(() => {
    onChange('endDate', swapBeforeAfter(state.endDate));
  }, [onChange, state.endDate]);

  let startTogglerClasses = 'admin-form__input-toggler';
  if (state.fromDate > 100000) startTogglerClasses += ' admin-form__input-toggler--ad';

  let endTogglerClasses = 'admin-form__input-toggler';
  if (state.endDate > 100000) endTogglerClasses += ' admin-form__input-toggler--ad';

  return (
    <AdminInput label="admin.duration" className="admin-date-input" wrapOnly>
      <input
        className="admin-form__text admin-form__text--cut-left"
        placeholder={t('admin.duration.from.placeholder')}
        value={renderYear(state.fromDate)}
        onChange={onStartChange}
      />
      <div className={startTogglerClasses} onClick={onSwapStart}>
        {t(isBC(state.fromDate) ? 'common.dateBC' : 'common.dateAD', { date: '' })}
      </div>
      {!fromOnly && (
        <React.Fragment>
          <div className="admin-form__between">{t('admin.until')}</div>
          <input
            className="admin-form__text admin-form__text--cut-left"
            placeholder={t('admin.duration.to.placeholder')}
            value={renderYear(state.endDate)}
            onChange={onEndChange}
          />
          <div className={endTogglerClasses} onClick={onSwapEnd}>
            {t(isBC(state.endDate) ? 'common.dateBC' : 'common.dateAD', { date: '' })}
          </div>
        </React.Fragment>
      )}
      {/* <AdminCheckbox
        label="admin.showTimeOnSite"
        className="admin-date-input__show"
        checked={state.showTimeOnSite}
        onChange={onShowChange}
      /> */}
    </AdminInput>
  );
};

export default AdminDateInput;
