import React, { useState, useRef, useCallback, useEffect } from 'react';
import './style.css';
import play from './play.svg';

const MediaAudio = ({ data, className }) => {
  const playerRef = useRef(null);

  const [playing, setPlaying] = useState(false);

  const onClick = useCallback(() => {
    if (!playerRef.current) return false;
    setPlaying(p => !p);
  }, []);

  useEffect(() => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.play();
    else playerRef.current.pause();
  }, [playing]);

  let classes = 'media-audio';
  if (className) classes += ` ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      <div className="media-audio__icon">
        {playing && <i className="fa fa-pause-circle-o media-audio__pause" />}
        {!playing && <img src={play} className="media-audio__play" />}
      </div>
      <div className="media-audio__title">{data.title}</div>
      <div className="media-audio__description">{data.description}</div>
      <audio className="media-audio__player" src={data.url} ref={playerRef} />
    </div>
  );
}

export default MediaAudio;
