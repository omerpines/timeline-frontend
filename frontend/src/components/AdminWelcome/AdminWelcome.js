import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getUserData } from 'store/selectors/authentication';
import config from 'constants/config';
import './style.css';

const AdminWelcome = () => {
  const { t } = useTranslation();
  const data = useSelector(getUserData);

  const avatarStyles = useMemo(() => {
    if (!data) return false;
    if (!data.avatar || !data.avatar.url) return false;
    return { backgroundImage: `url(${config.API + data.avatar.url})` };
  }, [data]);

  return (
    <div className="admin-welcome admin-form__columns">
      {data.avatar && data.avatar.url ? (
        <div className="admin-form__column admin-welcome__hello-column">
          <div className="admin-welcome__image" style={avatarStyles} />
        </div>
      ) : false}
      <div className="admin-form__column">
        <div className="admin-welcome__hello">{t('admin.hello')}</div>
        <div className="admin-welcome__name">{data.username}</div>
      </div>
    </div>
  );
};

export default AdminWelcome;
