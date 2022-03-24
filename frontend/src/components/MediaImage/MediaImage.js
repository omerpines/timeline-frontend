import React, { useMemo } from 'react';
import './style.css';

const MediaImage = ({ data, width, height, className }) => {
  const styles = useMemo(() => ({
    backgroundImage: `url(${data.url})`, 
    width,
    height,
  }), [data, width, height]);

  let classes = 'media-image';
  if (className) classes += ` ${className}`;

  return (
    <div className={classes}>
      <div className="media-image__image" style={styles} />
    </div>
  );
};

export default MediaImage;
