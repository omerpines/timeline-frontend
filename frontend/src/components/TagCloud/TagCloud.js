import React, { useMemo } from 'react';
import Tag from 'components/Tag';
import { cleanStringList } from 'helpers/util';
import './style.css';

const renderTag = tag => (
  <Tag data={tag} key={tag} className="tag-cloud__tag" />
);

const TagCloud = ({ tags, className }) => {
  let classes = 'tag-cloud';
  if (className) classes += ` ${className}`;

  const innerTags = useMemo(() => cleanStringList(tags), [tags]);

  return (
    <div className="tag-cloud">
      {innerTags.map(renderTag)}
    </div>
  );
};

export default TagCloud;
