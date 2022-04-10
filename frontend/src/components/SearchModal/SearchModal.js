import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Modal from "components/Modal";
import useData from "hooks/useData";
import useLanguage from "hooks/useLanguage";
import CharacterDot from "components/CharacterDot";
import ScrollArea from "react-scrollbar/dist/no-css";
import { sortEntitiesByUpdatedAt } from "helpers/time";
import { getLocalized } from "helpers/util";
import { getPeriodLink, getBookLink, getStoryLink, getEventLink, getCharacterLink } from "helpers/urls";
import "./style.css";

const emptyList = [];

const typeToLinkFnRelations = {
  period: getPeriodLink,
  book: getBookLink,
  story: getStoryLink,
  event: getEventLink,
  character: getCharacterLink,
};

const renderEntry = (t, lang, onClickLink) => e => {
  console.log(e);

  return (
    <tr className="admin-period-row" key={e.id}>
      <td>
        {e.type === 'character' && <CharacterDot data={e} className="search-modal__dot" />}
      </td>
      <td>{getLocalized(e, 'name', lang)}</td>
      <td>{t(e.type)}</td>
      <td>
        <Link to={typeToLinkFnRelations[e.type](e.id)} className="editText" onClick={onClickLink}>
          {t('search.edit')}
        </Link>
      </td>
    </tr>
  );
};

const SearchInput = ({ onClose }) => {
  const { t } = useTranslation();
  const lang = useLanguage();
  const data = useData();

  const [search, setSearch] = useState('');

  const onChange = useCallback((e) => {
    setSearch(e.currentTarget.value);
  });

  const entries = useMemo(() => {
    if (search.length < 3) return emptyList;

    return sortEntitiesByUpdatedAt([
      ...data.characters,
      ...data.events,
      ...data.books,
      ...data.stories,
      ...data.periods,
    ].filter(e => e.name.includes(search)));
  }, [data, search]);

  return (
    <Modal onClose={onClose}>
      <div className="modal__box auth__box search__box">
        <header className="modal__header search__header">
          <img src="/cross.png" onClick={onClose} />
          <div className="modal__title search__title">תוצאות חיפוש</div>
        </header>
        <div className="modal__body search__body">
          <div className="searchInputDiv">
            <i className="fa fa-search"></i>
            <input placeholder="משה" onChange={onChange} value={search} />
          </div>
          <div className="tableBody">
          <ScrollArea
            vertical
            smoothScrolling
            className="aside__scrollarea media-modal__links"
            contentClassName="aside__scrollable media-modal__links-content"
          >
            <table className="table table-striped">
              <thead>
                <tr>
                  <th />
                  <th>{t("search.type")}</th>
                  <th>{t("search.name")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {entries.map(renderEntry(t, lang, onClose))}
              </tbody>
            </table>
            </ScrollArea>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SearchInput;
