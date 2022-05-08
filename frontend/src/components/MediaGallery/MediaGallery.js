import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Media from 'components/Media';
import './style.css';

const renderMedia = media => (
  <li className="media-gallery__slide" key={media.id}>
    <Media data={media}  />
  </li>
);

const MediaGallery = ({ data }) => {
  const ref = useRef();
  const [shift, setShift] = useState(0);
  const [size, setSize] = useState(0);
  
  useEffect(() => {
    if (!ref.current) return;
    const { width } = ref.current.getBoundingClientRect();
    setSize(width);
  }, [ref.current]);

  const styles = useMemo(() => {
    return {
      right: size * shift * -1,
    };
  }, [size, shift]);

  const onRight = useCallback(() => {
    setShift(s => (s === 0 ? 0 : s - 1));
  }, []);

  const onLeft = useCallback(() => {
    const max = data.length - 1;
    setShift(s => (s === max ? max : s + 1));
  }, [data]);

  let leftClasses = 'fa fa-chevron-left media-gallery__icon media-gallery__icon--left';
  if (data && data.length && shift === data.length - 1) leftClasses += ' media-gallery__icon--hidden';

  let rightClasses = 'fa fa-chevron-right media-gallery__icon media-gallery__icon--right';
  if (shift === 0) rightClasses += ' media-gallery__icon--hidden';

  if (!data || !data.length) return false;

  return (
    <div className="media-gallery" ref={ref}>
      <ul className="media-gallery__gallery" style={styles}>
        {data.map(renderMedia)}
      </ul>
      <i className={leftClasses} onClick={onLeft} />
      <i className={rightClasses} onClick={onRight} />
    </div>
  );
};

export default MediaGallery;
