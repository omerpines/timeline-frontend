import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactHtmlParser from 'react-html-parser';
import Aside from 'components/Aside';
import TagCloud from 'components/TagCloud';
import EntityBlock from 'components/EntityBlock';
import useData from 'hooks/useData';
import useLanguage from 'hooks/useLanguage';
import { getBookLink } from 'helpers/urls';
import { getLocalized } from 'helpers/util';
import config from 'constants/config';

const renderBook = data => (
  <EntityBlock key={data.id} data={data} linkFn={getBookLink} />
);

const PeriodAside = () => {
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
    return books.filter(b => b.period === pid);
  }, [books, pid]);

  const content = useMemo(() => {
    if (!data) return false;
    return (
      <React.Fragment>
        <div className="aside__background" style={backgroundStyles} />
        <div className="aside__characters">
          {relatedBooks.map(renderBook)}
        </div>
        {ReactHtmlParser(`<div>${getLocalized(data, 'description', lang)}</div>`)}
        {ReactHtmlParser(`<div>${getLocalized(data, 'majorEvents', lang)}</div>`)}
        {!data.links ? false : (
          <React.Fragment>
            <div className="aside__paragraph-title">{t('admin.forMoreInformation')}</div>
            {ReactHtmlParser(`<div>${getLocalized(data, 'links', lang)}</div>`)}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }, [data, lang, backgroundStyles]);

  const header = useMemo(() => {
    if (!data) return undefined;
    return (
      <React.Fragment>
        <div className="aside__title">{getLocalized(data, 'name', lang)}</div>
        <div className="aside__subtitle">{getLocalized(data, 'shortDescription', lang)}</div>
      </React.Fragment>
    );
  }, [data]);

  if (!data) return false;

  return (
    <Aside header={header}>
      {data.tags ? (
        <TagCloud tags={data.tags} />
      ) : false}
      {content}
    </Aside>
  );
};

export default PeriodAside;
