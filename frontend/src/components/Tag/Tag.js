import React from 'react';
import './style.css';

const Tag = React.memo(({ data, className }) => {

  let classes = 'tag';
  if (className) classes += ` ${className}`;

  return (
    <div className={classes}>
      {data}
    </div>
  );
});

export default Tag;
