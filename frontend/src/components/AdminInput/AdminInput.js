import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './style.css';

const richTextConfig = {
  fontFamily: 'Assistant',
  language: 'he',
  removePlugins: ['Heading'],
  link: { addTargetToExternalLinks: true },
};

const AdminInput = ({ children, label, type, placeholder, name, value, onChange, className, wrapOnly, ltr }) => {
  const { t } = useTranslation();

  let classes = 'admin-input';
  if (className) classes += ` ${className}`;
  if (ltr) classes += ' admin-input--ltr';

  const ph = placeholder || `${label}.placeholder`;

  const inputRef = useRef(null);

  const onChangeInput = useCallback(e => {
    const value = e.currentTarget.value;
    onChange(name, value);
  }, [name, onChange]);

  const onChangeRichText = useCallback((e, editor) => {
    const value = editor.getData();
    onChange(name, value);
  }, [name, onChange]);

  const onFocus = useCallback(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className={classes}>
      {label && <div className="admin-form__label" onClick={onFocus}>{t(label)}</div>}
      {!wrapOnly && type !== 'textarea' && (
        <input
          className="admin-form__text"
          type={type}
          placeholder={t(ph)}
          value={value}
          onChange={onChangeInput}
          ref={inputRef}
        />
      )}
      {!wrapOnly && type === 'textarea' && (
        <CKEditor
          editor={ClassicEditor}
          data={value || ''}
          onChange={onChangeRichText}
          className="admin-form__textarea"
          config={richTextConfig}
        />
      )}
      {children}
    </div>
  );
};

export default AdminInput;
