import React from 'react';
import MediaImage from 'components/MediaImage';
import MediaYoutube from 'components/MediaYoutube';

const Media = ({ data, width, height, className }) => {
  const { type } = data;

  if (type === 'image')   return <MediaImage   data={data} width={width} height={height} className={className} />;
  if (type === 'youtube') return <MediaYoutube data={data} width={width} height={height} className={className} />;
};

export default Media;
