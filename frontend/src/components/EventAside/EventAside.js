import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactHtmlParser from 'react-html-parser';
import Aside from 'components/Aside';
import CharacterBlock from 'components/CharacterBlock';
import QuoteBlock from 'components/QuoteBlock';
import MediaGallery from 'components/MediaGallery';
import useData from 'hooks/useData';
import useLanguage from 'hooks/useLanguage';
import { getLocalized, denormalize } from 'helpers/util';
import { getStoryLink } from 'helpers/urls';
import './style.css';

const renderCharacter = data => (data ? (
  <CharacterBlock key={data.id} data={data} className="story-aside__character" />
) : false);

const EventAside = () => {
  const { id } = useParams();
  const lang = useLanguage();
  const { t } = useTranslation();

  const { events, characters, stories } = useData();

  const data = useMemo(() => {
    const pid = parseInt(id);
    return events.find(s => s.id === pid);
  }, [events, id]);

  const relatedStory = useMemo(() => {
    console.log(data, stories);
    if (!data) return null;
    return stories.find(s => s.id === data.story);
  }, [data, stories]);

  const content = useMemo(() => {
    if (!data) return false;
    return (
      <React.Fragment>
      {ReactHtmlParser(`<div>${getLocalized(data, 'references', lang)}</div>`)}
      {ReactHtmlParser(`<div>${getLocalized(data, 'location', lang)}</div>`)}
      {!data.links ? false : (
        <React.Fragment>
          <div className="aside__paragraph-title">{t('admin.forMoreInformation')}</div>
          {ReactHtmlParser(`<div>${getLocalized(data, 'links', lang)}</div>`)}
        </React.Fragment>
      )}
      </React.Fragment>
    );
  }, [data, lang]);

  const chars = useMemo(() => {
    if (!data) return false;
    return data.secondaryCharacters ? [...data.characters, ...data.secondaryCharacters] : data.characters;
  }, [data]);

  const characterData = useMemo(() => {
    if (!data) return false;
    return denormalize(chars, characters);
  }, [chars, characters]);

  const header = useMemo(() => {
    if (!data) return undefined;
    return (
      <React.Fragment>
        <div className="aside__title">{getLocalized(data, 'name', lang)}</div>
        <div className='aside__header-img'>
          <img src='/imagePreview.png'/>
        </div>
        <div className="aside__subtitle">{getLocalized(data, 'shortDescription', lang)}</div>
        {!relatedStory ? false : (
          <Link
            className="aside__subsubtitle"
            to={getStoryLink(relatedStory.id)}
          >
            {getLocalized(relatedStory, 'name', lang)}
          </Link>
        )}
      </React.Fragment>
    );
  }, [data]);

  if (!data) return false;

  return (
    <Aside header={header} className="event__aside">
      <MediaGallery data={data.media} />
      <div className="aside__characters">
        {characterData.map(renderCharacter)}
      </div>
      <QuoteBlock data={data} />
      {content}
    </Aside>
  );
};

export default EventAside;
