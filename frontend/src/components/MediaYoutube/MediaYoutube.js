import React, { useMemo } from 'react';
import YouTube from 'react-youtube';

const MediaYoutube = ({ data, width, height, className }) => {
  const opts = useMemo(() => ({
    width: width.toString(),
    height: height.toString(),
  }), [width, height]);

  let classes = 'media-youtube';
  if (className) classes += ` ${className}`;

  return (
    <div className={classes}>
      <YouTube videoId={data.youtubeId} opts={opts} />
    </div>
  );
};

export default MediaYoutube;
