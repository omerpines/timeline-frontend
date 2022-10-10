import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactHtmlParser from 'react-html-parser';
import Aside from 'components/Aside';
import CharacterBlock from 'components/CharacterBlock';
import EntityBlock from 'components/EntityBlock';
import TagCloud from 'components/TagCloud';
import MediaGallery from 'components/MediaGallery';
import useData from 'hooks/useData';
import useLanguage from 'hooks/useLanguage';
import useEntityZoom from 'hooks/useEntityZoom';
import { getLocalized } from 'helpers/util';
import { getStoryLink } from 'helpers/urls';

const renderCharacter = data => (
  <CharacterBlock data={data} key={data.id} />
);

const renderStory = data => (
  <EntityBlock key={data.id} data={data} linkFn={getStoryLink} />
);

const BookAside = ({ zoomTo, min, max }) => {
  const { id } = useParams();
  const pid = parseInt(id, 10);
  const lang = useLanguage();
  const { t } = useTranslation();

  const { books, stories } = useData();

  const data = useMemo(() => {
    const pid = parseInt(id);
    return books.find(s => s.id === pid);
  }, [books, id]);

  const relatedStories = useMemo(() => {
    return stories.filter(s => s.book === pid);
  }, [stories, pid]);

  const content = useMemo(() => {
    if (!data) return false;
    return (
      <React.Fragment>
      <div className="aside__paragraph-title">{t('data.stories')}</div>
      <div className="aside__characters">
        {relatedStories.map(renderStory)}
      </div>
      {ReactHtmlParser(`<div>${getLocalized(data, 'summary', lang)}</div>`)}
      {ReactHtmlParser(`<div>${getLocalized(data, 'content', lang)}</div>`)}
      {ReactHtmlParser(`<div>${getLocalized(data, 'location', lang)}</div>`)}
      <div className="aside__paragraph-title">{t('data.mainCharacters')}</div>
      <div className="aside__characters">
        {data.characters.map(renderCharacter)}
      </div>
      {!data.links ? false : (
        <React.Fragment>
          <div className="aside__paragraph-title">{t('admin.forMoreInformation')}</div>
          {ReactHtmlParser(`<div>${getLocalized(data, 'links', lang)}</div>`)}
        </React.Fragment>
      )}
      </React.Fragment>
    );
  }, [data, lang]);

  const header = useMemo(() => {
    if (!data) return undefined;
    return (
      <React.Fragment>
        <div className="aside__title">{getLocalized(data, 'name', lang)}</div>
        <div className="aside__subsubtitle">{getLocalized(data, 'age', lang)}</div>
      </React.Fragment>
    );
  }, [data]);

  const gallery = useMemo(() => {
    if (!data) return false;

    return (
      <React.Fragment>
        {data.tags ? (
          <TagCloud tags={data.tags} />
        ) : false}
        <MediaGallery data={data.media} />
      </React.Fragment>
    );
  }, [data]);

  useEntityZoom(data, zoomTo, min, max);

  if (!data) return false;

  return (
    <Aside
      header={header}
      fullscreenGallery={gallery}
      fullscreenContent={content}
      data={data}
    >
      {gallery}
      {content}
    </Aside>
  );
};

export default BookAside;
