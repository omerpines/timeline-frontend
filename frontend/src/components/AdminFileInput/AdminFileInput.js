import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUploader } from 'react-drag-drop-files';
import { getFileUrl } from 'helpers/util';
import './style.css';

const fileTypes = ['jpg', 'png'];

const AdminFileInput = ({ name, value, onChange, label, labelInside, noLabel, className }) => {
  const { t } = useTranslation();

  const onChangeInput = useCallback(val => {
    onChange(name, val);
  }, [name]);

  const styles = useMemo(() => {
    if (!value) return {};
    const url = getFileUrl(value);
    return {
      backgroundImage: `url(${url})`,
    };
  }, [value]);

  let classes = 'admin-file-input';
  if (className) classes += ` ${className}`;

  return (
    <div className={classes}>
      {!labelInside && !noLabel && <div className="admin-form__label">{t(label)}</div>}
      <div className="admin-file-input__uploader">
        <div className="admin-file-input__background" style={styles} />
        <FileUploader
          handleChange={onChangeInput}
          name="image"
          file={fileTypes}
          classes="admin-file-input__droparea"
        >
          {labelInside && !noLabel && <div className="admin-file-input__label">{t(label)}</div>}
          {!value && <div className="admin-file-input__title">{t('admin.dragFiles')}</div>}
          {!value && <div className="admin-file-input__subtitle">{t('admin.clickFiles')}</div>}
        </FileUploader>
      </div>
    </div>
  );
};

export default AdminFileInput;
