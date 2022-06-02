import React from 'react';
import useLanguage from 'hooks/useLanguage';
import { getLocalized } from 'helpers/util';
import './style.css';

const QuoteBlock = ({ data }) => {
  const lang = useLanguage();

  if (!data || !data.quote) return false;

  return (
    <div className="quote-block">
      <i className="fa fa-quote-left quote-block__icon-left" />
      <i className="fa fa-quote-right quote-block__icon-right" />
      <div className="quote-block__text">{getLocalized(data, 'quote', lang)}</div>
      <div className="quote-block__source">{getLocalized(data, 'quotesource', lang)}</div>
    </div>
  );
};

export default QuoteBlock;
