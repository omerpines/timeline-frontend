import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactHtmlParser from 'react-html-parser';
import Aside from 'components/Aside';
import CharacterBlock from 'components/CharacterBlock';
import TagCloud from 'components/TagCloud';
import MediaGallery from 'components/MediaGallery';
import useData from 'hooks/useData';
import useLanguage from 'hooks/useLanguage';
import { getLocalized, denormalize } from 'helpers/util';
import './style.css';

const renderCharacter = data => (
  <CharacterBlock key={data.id} data={data} />
);

const StoryAside = () => {
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

  const content = useMemo(() => {
    if (!data) return false;
    return (
      <React.Fragment>
        <div className="aside__characters">
          {characterData.map(renderCharacter)}
        </div>
        {ReactHtmlParser(`<div>${getLocalized(data, 'location', lang)}</div>`)}
        {ReactHtmlParser(`<div>${getLocalized(data, 'summary', lang)}</div>`)}
        {ReactHtmlParser(`<div>${getLocalized(data, 'plot', lang)}</div>`)}
        {ReactHtmlParser(`<div>${getLocalized(data, 'references', lang)}</div>`)}
        {!data.links ? false : (
          <React.Fragment>
            <div className="aside__paragraph-title">{t('admin.forMoreInformation')}</div>
            {ReactHtmlParser(`<div>${getLocalized(data, 'links', lang)}</div>`)}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }, [data, characterData, lang]);

  const header = useMemo(() => {
    if (!data) return false;
    return (
      <React.Fragment>
        <div className="aside__title">{getLocalized(data, 'name', lang)}</div>
        <div className="aside__subtitle">{getLocalized(data, 'shortDescription', lang)}</div>
        {!relatedBook ? false : (
          <div className="aside__subsubtitle">{getLocalized(relatedBook, 'name', lang)}</div>
        )}
      </React.Fragment>
    );
  }, [data]);

  if (!data) return false;

  return (
    <Aside header={header}>
      <div className="aside__characters">
        {data.tags ? (
          <TagCloud tags={data.tags} />
        ) : false}
        <MediaGallery data={data.media} />
      </div>
      {content}
    </Aside>
  );
};

export default StoryAside;
