import React, { useMemo, useCallback  } from 'react';
import './style.css';

const MediaVideo = ({ data, width, height, className, onClick, index }) => {
  const styles = useMemo(() => ({
    width,
    height,
  }), [width, height]);

  const innerOnClick = useCallback(e => {
    e.preventDefault();
    onClick(e);
  }, [onClick]);

  let classes = 'media-video';
  if (className) classes += ` ${className}`;

  return (
    <div className={classes}>
      <video className="media-video__video" src={data.url} style={styles} controls onClick={innerOnClick} data-index={index} />
    </div>
  );
};

export default MediaVideo;
