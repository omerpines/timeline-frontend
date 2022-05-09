import React, { useMemo } from 'react';
import './style.css';

const MediaVideo = ({ data, width, height, className }) => {
  const styles = useMemo(() => ({
    width,
    height,
  }), [width, height]);

  let classes = 'media-video';
  if (className) classes += ` ${className}`;

  return (
    <div className={classes}>
      <video className="media-video__video" src={data.url} style={styles} controls />
    </div>
  );
};

export default MediaVideo;
