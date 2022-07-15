import React from 'react';
import MediaImage from 'components/MediaImage';
import MediaYoutube from 'components/MediaYoutube';
import MediaVideo from 'components/MediaVideo';
import MediaAudio from 'components/MediaAudio';

const Media = ({ data, className, onClick, index }) => {
  const { type } = data;

  if (type === 'image')   return <MediaImage data={data} className={className} onClick={onClick} index={index} />;
  if (type === 'youtube') return <MediaYoutube data={data} className={className} onClick={onClick} index={index} />;
  if (type === 'video')   return <MediaVideo data={data} className={className} onClick={onClick} index={index} />;
  if (type === 'audio')   return <MediaAudio data={data} className={className} onClick={onClick} index={index} />;
};

export default Media;
