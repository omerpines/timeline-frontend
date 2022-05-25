import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import FsLightbox from 'fslightbox-react';
import Media from 'components/Media';
import './style.css';

const renderMedia = onClick => (media, i) => (
  <li className="media-gallery__slide" key={media.id}>
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

  const [urls, types, attrs, captions] = useMemo(() => {
    if (!data) return [[], [], [], []];

    return [
      data.map(d => d.url || `https://youtu.be/${d.youtubeId}`),
      data.map(d => d.type),
      data.map(d => (d.description ? { alt: d.description } : null)),
      data.map(d => (
        <React.Fragment>
          <h2>{d.title}</h2>
          <div>{d.description}</div>
        </React.Fragment>
      ))
    ];
  }, [data]);

  let leftClasses = 'fa fa-chevron-left media-gallery__icon media-gallery__icon--left';
  if (data && data.length && shift === data.length - 1) leftClasses += ' media-gallery__icon--hidden';

  let rightClasses = 'fa fa-chevron-right media-gallery__icon media-gallery__icon--right';
  if (shift === 0) rightClasses += ' media-gallery__icon--hidden';

  if (!data || !data.length) return false;

  return (
    <div className="media-gallery" ref={ref}>
      <ul className="media-gallery__gallery" style={styles}>
        {data.map(renderMedia(onToggle))}
      </ul>
      <i className={leftClasses} onClick={onLeft} />
      <i className={rightClasses} onClick={onRight} />
      {data ? (
        <FsLightbox
          toggler={toggler}
          sources={urls}
          types={types}
          customAttributes={attrs}
          captions={captions}
          slide={slideIndex}
        />
      ) : null}
    </div>
  );
};

export default MediaGallery;
