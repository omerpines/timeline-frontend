import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactHtmlParser from 'react-html-parser';
import Aside from 'components/Aside';
import TagCloud from 'components/TagCloud';
import EntityBlock from 'components/EntityBlock';
import MediaGallery from 'components/MediaGallery';
import useData from 'hooks/useData';
import useLanguage from 'hooks/useLanguage';
import useEntityZoom from 'hooks/useEntityZoom';
import { getBookLink } from 'helpers/urls';
import { getLocalized } from 'helpers/util';
import { sortEntitiesByEndDate } from 'helpers/time';
import config from 'constants/config';

const renderBook = data => (
  <EntityBlock key={data.id} data={data} linkFn={getBookLink} />
);

const PeriodAside = ({ zoomTo, min, max }) => {
  const { id } = useParams();
  const lang = useLanguage();
  const { t } = useTranslation();

  const pid = parseInt(id, 10);

  const { periods, books } = useData();

  const data = useMemo(() => {
    return periods.find(p => p.id === pid);
  }, [periods, pid]);

  const backgroundStyles = useMemo(() => {
    if (!data || !data.image || !data.image.data) return {};
    return {
      backgroundImage: `url(${config.API}${data.image.data.attributes.url})`,
    };
  }, [data]);

  const relatedBooks = useMemo(() => {
    return books.filter(b => b.period === pid).sort(sortEntitiesByEndDate);
  }, [books, pid]);

  const gallery = useMemo(() => {
    if (!data) return false;

    return (
      <React.Fragment>
        {data.image && data.image.data ? (
          <div className="aside__background" style={backgroundStyles} />
        ) : false}
        {data.tags ? (
          <TagCloud tags={data.tags} />
        ) : false}
        <MediaGallery data={data.media} />
      </React.Fragment>
    );
  }, [data]);

  const content = useMemo(() => {
    if (!data) return false;
    return (
      <React.Fragment>
        {ReactHtmlParser(`<div>${getLocalized(data, 'description', lang)}</div>`)}
        {!data.majorEvents ? false : (
          <React.Fragment>
            <div className="aside__paragraph-label">{t('aside.label.majorEvents')}</div>
            {ReactHtmlParser(`<div>${getLocalized(data, 'majorEvents', lang)}</div>`)}
          </React.Fragment>
        )}
        {!data.links ? false : (
          <React.Fragment>
            <div className="aside__paragraph-label">{t('aside.label.furtherReading')}</div>
            {ReactHtmlParser(`<div>${getLocalized(data, 'links', lang)}</div>`)}
          </React.Fragment>
        )}
        {!relatedBooks.length ? false : (
          <React.Fragment>
            <div className="aside__paragraph-label">{t('aside.label.books')}</div>
            <div className="aside__books">
              {relatedBooks.map(renderBook)}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }, [data, lang, backgroundStyles, gallery]);

  const header = useMemo(() => {
    if (!data) return undefined;
    return (
      <React.Fragment>
        <div className="aside__title">{getLocalized(data, 'name', lang)}</div>
        <div className="aside__subsubtitle">{getLocalized(data, 'shortDescription', lang)}</div>
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

export default PeriodAside;
