import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactHtmlParser from 'react-html-parser';
import Aside from 'components/Aside';
import CharacterBlock from 'components/CharacterBlock';
import TagCloud from 'components/TagCloud';
import MediaGallery from 'components/MediaGallery';
import useData from 'hooks/useData';
import useLanguage from 'hooks/useLanguage';
import useEntityZoom from 'hooks/useEntityZoom';
import { getLocalized, denormalize } from 'helpers/util';
import { getBookLink } from 'helpers/urls';
import './style.css';

const renderCharacter = data => (
  <CharacterBlock key={data.id} data={data} />
);

const StoryAside = ({ zoomTo, min, max }) => {
  const { id } = useParams();
  const lang = useLanguage();
  const { t } = useTranslation();

  const { stories, characters, books } = useData();

  const data = useMemo(() => {
    const sid = parseInt(id);
    return stories.find(s => s.id === sid);
  }, [stories, id]);

  const relatedBook = useMemo(() => {
    if (!data) return null;
    return books.find(b => b.id === data.book);
  }, [books, data]);

  const storyCharacters = useMemo(() => (
    data
    ? [...data.characters, ...data.secondaryCharacters].map(c => c.id)
    : []
  ), [data]);

  const characterData = useMemo(() => {
    if (!storyCharacters || !storyCharacters.length || !characters || !characters.length) return [];
    return denormalize(storyCharacters, characters);
  }, [characters, storyCharacters]);

  const gallery = useMemo(() => {
    if (!data) return false;

    return (
      <div className="aside__characters">
        {data.tags ? (
          <TagCloud tags={data.tags} />
        ) : false}
        <MediaGallery data={data.media} />
      </div>
    );
  }, [data]);

  const content = useMemo(() => {
    if (!data) return () => false;
    return withMedia => (
      <React.Fragment>
        {!data.references ? false : ReactHtmlParser(`<div>${getLocalized(data, 'references', lang)}</div>`)}
        {!data.summary ? false : (
          <React.Fragment>
            {/* <div className="aside__paragraph-label">{t('aside.label.summary')}</div> */}
            {ReactHtmlParser(`<div>${getLocalized(data, 'summary', lang)}</div>`)}
          </React.Fragment>
        )}
        {withMedia && gallery}
        {!data.plot ? false : (
          <React.Fragment>
            <div className="aside__paragraph-label">{t('aside.label.plot')}</div>
            {ReactHtmlParser(`<div>${getLocalized(data, 'plot', lang)}</div>`)}
          </React.Fragment>
        )}
        {!data.location ? false : (
          <React.Fragment>
            <div className="aside__paragraph-label">{t('aside.label.storyLocation')}</div>
            {ReactHtmlParser(`<div>${getLocalized(data, 'location', lang)}</div>`)}
          </React.Fragment>
        )}
        {!characterData.length ? false : (
          <React.Fragment>
            <div className="aside__paragraph-label">{t('aside.label.characters')}</div>
            <div className="aside__characters">
              {characterData.map(renderCharacter)}
            </div>
          </React.Fragment>
        )}
        {!data.links ? false : (
          <React.Fragment>
            <div className="aside__paragraph-label">{t('aside.label.furtherReading')}</div>
            {ReactHtmlParser(`<div>${getLocalized(data, 'links', lang)}</div>`)}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }, [data, characterData, gallery, lang]);

  const fullscreenContent = useMemo(() => content(false), [content]);
  const asideContent = useMemo(() => content(true), [content]);

  const header = useMemo(() => {
    if (!data) return false;
    return (
      <React.Fragment>
        <div className="aside__title">{getLocalized(data, 'name', lang)}</div>
        {!relatedBook ? false : (
          <Link
            className="aside__subsubtitle"
            to={getBookLink(relatedBook.id)}
          >
            {getLocalized(relatedBook, 'name', lang)}
          </Link>
        )}
      </React.Fragment>
    );
  }, [data]);

  useEntityZoom(data, zoomTo, min, max);

  if (!data) return false;

  return (
    <Aside
      header={header}
      fullscreenContent={fullscreenContent}
      fullscreenGallery={gallery}
      data={data}
    >
      {asideContent}
    </Aside>
  );
};

export default StoryAside;
