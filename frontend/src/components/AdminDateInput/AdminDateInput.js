import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminInput from 'components/AdminInput';
import { parseYear, renderYear } from 'helpers/time';
import './style.css';

const AdminDateInput = ({ onChange, state, fromOnly }) => {
  const { t } = useTranslation();

  const [start, setStart] = useState(renderYear(state.fromDate));
  const [end, setEnd] = useState(renderYear(state.endDate));

  const onStartChange = useCallback(e => {
    let value = parseInt(e.currentTarget.value, 10);
    setStart(e.currentTarget.value);
    if (!value || value === 0 || Number.isNaN(value)) {
      onChange('fromDate', null);
      return;
    }
    let newVal = parseYear(value);
    onChange('fromDate', newVal);
    if (fromOnly) onChange('endDate', newVal);
  }, [onChange, state.endDate, state.fromDate, fromOnly]);

  const onEndChange = useCallback(e => {
    let value = parseInt(e.currentTarget.value, 10);
    setEnd(e.currentTarget.value);
    if (!value || value === 0 || Number.isNaN(value)) {
      onChange('endDate', null);
      return;
    }
    let newVal = parseYear(value);
    onChange('endDate', newVal);
  }, [onChange, state.fromDate, state.endDate]);

  useEffect(() => {
    if (state.fromDate) setStart(renderYear(state.fromDate));
  }, [state.fromDate]);

  useEffect(() => {
    if (state.endDate) setEnd(renderYear(state.endDate));
  }, [state.endDate]);

  return (
    <AdminInput label="admin.duration" className="admin-date-input" wrapOnly>
      <input
        className="admin-form__text admin-input--ltr"
        placeholder={t('admin.duration.from.placeholder')}
        value={start}
        onChange={onStartChange}
      />
      {!fromOnly && (
        <React.Fragment>
          <div className="admin-form__between">{t('admin.until')}</div>
          <input
            className="admin-form__text admin-input--ltr"
            placeholder={t('admin.duration.to.placeholder')}
            value={end}
            onChange={onEndChange}
          />
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
