import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import FsLightbox from 'fslightbox-react';
import Media from 'components/Media';
import './style.css';

const renderMedia = onClick => (media, i) => (
  <li className={media.type === 'audio' ? 'media-gallery__audio' : 'media-gallery__slide'} key={media.id}>
    <Media data={media} onClick={onClick} index={i + 1} />
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

  const [toggler, setToggler] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const onToggle = useCallback(e => {
    const { index } = e.currentTarget.dataset;
    setSlideIndex(parseInt(index, 10));
    setToggler(t => !t);
  }, []);

  const [audioData, otherData] = useMemo(() => {
    if (!data || !data.length) return [[], []];
    return [
      data.filter(d => d.type === 'audio'),
      data.filter(d => d.type !== 'audio'),
    ];
  }, [data]);

  const [urls, types, attrs, captions] = useMemo(() => {
    if (!otherData.length) return [[], [], [], []];

    return [
      otherData.map(d => d.url || `https://youtu.be/${d.youtubeId}`),
      otherData.map(d => d.type),
      otherData.map(d => (d.description ? { alt: d.description } : null)),
      otherData.map(d => (
        <React.Fragment>
          <h2>{d.title}</h2>
          <div>{d.description}</div>
        </React.Fragment>
      ))
    ];
  }, [otherData]);

  let leftClasses = 'fa fa-chevron-left media-gallery__icon media-gallery__icon--left';
  if (otherData && otherData.length && shift === otherData.length - 1) leftClasses += ' media-gallery__icon--hidden';

  let rightClasses = 'fa fa-chevron-right media-gallery__icon media-gallery__icon--right';
  if (shift === 0) rightClasses += ' media-gallery__icon--hidden';

  if (!data || !data.length) return false;

  return (
    <React.Fragment>
      <div className="media-gallery" ref={ref}>
        {otherData.length > 0 && (
          <React.Fragment>
            <ul className="media-gallery__gallery" style={styles}>
              {otherData.map(renderMedia(onToggle))}
            </ul>
            <i className={leftClasses} onClick={onLeft} />
            <i className={rightClasses} onClick={onRight} />
            <FsLightbox
              toggler={toggler}
              sources={urls}
              types={types}
              customAttributes={attrs}
              captions={captions}
              slide={slideIndex}
            />
          </React.Fragment>
        )}
      </div>
      {audioData.length> 0 && (
        <ul className="media-gallery-audios">
          {audioData.map(renderMedia(onToggle))}
        </ul>
      )}
    </React.Fragment>
  );
};

export default MediaGallery;
