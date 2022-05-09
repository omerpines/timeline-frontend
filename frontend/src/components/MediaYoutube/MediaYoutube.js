import React, { useMemo } from 'react';
import YouTube from 'react-youtube';

const MediaYoutube = ({ data, width, height, className }) => {
  const opts = useMemo(() => (width && height ? {
    width: width.toString(),
    height: height.toString(),
  } : {
    width: '500',
    height: '260',
  }), [width, height]);

  let classes = 'media-youtube';
  if (className) classes += ` ${className}`;

  if (!opts) return false;

  return (
    <div className={classes}>
      <YouTube videoId={data.youtubeId} opts={opts} />
    </div>
  );
};

export default MediaYoutube;
