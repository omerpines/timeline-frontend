import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SearchModal from 'components/SearchModal';
import './style.css';

const useSearchModal = () => {
  const [show, setShow] = useState(false);

  const onOpen = useCallback(() => {
    setShow(true);
  }, []);

  const onClose = useCallback(() => {
    setShow(false);
  }, []);

  return [onOpen, onClose, show];
};

const SearchBar = () => {
  const { t } = useTranslation();

  const [onOpen, onClose, isVisible] = useSearchModal();

  return (
    <React.Fragment>
      <div className="searchbar" onClick={onOpen}>
        <div className="searchbar__image">
          <i className="fa fa-search" />
        </div>
        <div className="searchbar__text">{t('search.placeholder')}</div>
      </div>
      {isVisible && <SearchModal onClose={onClose} />}
    </React.Fragment>
  );
};

export default SearchBar;
