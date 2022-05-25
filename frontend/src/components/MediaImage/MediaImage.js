import React, { useMemo } from 'react';
import './style.css';

const MediaImage = ({ data, width, height, className, onClick, index }) => {
  const styles = useMemo(() => ({
    backgroundImage: `url(${data.smallUrl || data.url})`, 
    width,
    height,
  }), [data, width, height]);

  let classes = 'media-image';
  if (className) classes += ` ${className}`;

  return (
    <React.Fragment>
      <div className={classes}>
        <div className="media-image__image" style={styles} onClick={onClick} data-index={index} />
      </div>
    </React.Fragment>
  );
};

export default MediaImage;
