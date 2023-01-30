import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactHtmlParser from 'react-html-parser';
import Aside from 'components/Aside';
import CharacterDot from 'components/CharacterDot';
import CharacterBlock from 'components/CharacterBlock';
import TagCloud from 'components/TagCloud';
import QuoteBlock from 'components/QuoteBlock';
import MediaGallery from 'components/MediaGallery';
import useData from 'hooks/useData';
import useLanguage from 'hooks/useLanguage';
import useEntityZoom from 'hooks/useEntityZoom';
import { checkLocalized, getLocalized } from 'helpers/util';
import './style.css';

const renderCharacter = data => (data ? (
  <CharacterBlock key={data.id} data={data} className="character-aside__character" />
) : false);

const CharacterAside = ({ zoomTo, min, max }) => {
  const { id } = useParams();
  const lang = useLanguage();
  const { t } = useTranslation();

  const { characters } = useData();

  const data = useMemo(() => {
    const cid = parseInt(id);
    return characters.find(s => s.id === cid);
  }, [characters, id]);

  const tags = useMemo(() => {
    if (!data) return '';
    const gender = t(`admin.gender.${data.gender}`);
    return `${gender}, ${data.role}, ${data.nation}, ${data.tags}`;
  }, [data]);

  const relatedCharacters = useMemo(() => {
    if (!data) return null;
    return data.characters.map(([id, relation]) => {
      const char = characters.find(c => c.id === id);
      if (!char) return null;
      return { ...char, relation };
    }).filter(a => !!a);
  }, [characters, data]);

  const content = useMemo(() => {
    if (!data) return false;
    return (
      <React.Fragment>
        {ReactHtmlParser(`<div>${getLocalized(data, 'content', lang)}</div>`)}
        {ReactHtmlParser(`<div>${getLocalized(data, 'appearances', lang)}</div>`)}
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
        <div className="character-aside__title">
          {getLocalized(data, 'name', lang)}
          <CharacterDot data={data} className="character-aside__dot" ignorable />
        </div>
        {checkLocalized(data, 'summary', lang) && (
          <div className="character-aside__subsubtitle aside__subsubtitle">
            {ReactHtmlParser(getLocalized(data, 'summary', lang))}
          </div>
        )}
      </React.Fragment>
    );
  }, [data]);

  const gallery = useMemo(() => {
    if (!data) return false;

    return (
      <React.Fragment>
        {data.tags ? (
          <TagCloud tags={tags} />
        ) : false}
        <MediaGallery data={data.media} />
        <QuoteBlock data={data} />
        <div className="aside__characters">
          {relatedCharacters.map(renderCharacter)}
        </div>
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

export default CharacterAside;
