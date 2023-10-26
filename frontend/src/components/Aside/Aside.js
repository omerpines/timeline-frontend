import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from 'components/Modal';
import ScrollArea from 'react-scrollbar/dist/no-css';
import useFullscreen from 'hooks/useFullscreen';
import useLanguage from 'hooks/useLanguage';
import { getLocalized } from 'helpers/util';
import './style.scss';

const Aside = ({ children, header, className, fullscreenGallery, fullscreenContent, data }) => {
  const { t } = useTranslation();
  const lang = useLanguage();
  const navigate = useNavigate();

  const [exit, setExit] = useState(false);
  const [isFullscreen, toggleFullscreen] = useFullscreen();

  useEffect(() => {
    const triggerResize = () =>  window.dispatchEvent(new Event('resize'));

    triggerResize();

    let animate = { current: true };
    const loop = () => {
      triggerResize();
      if (animate.current) window.requestAnimationFrame(loop);
    };

    window.setTimeout(() => {
      animate.current = false;
      if (exit) {
        navigate('/');
        // window.location.reload();
      }
    }, 200);

    loop();

    return () => window.setTimeout(triggerResize, 0);
  }, [exit]);

  const onBack = useCallback(e => {
    e.preventDefault();
    setExit(true);
  }, []);

  const onWheel = useCallback(e => {
    e.stopPropagation();
  }, []);

  let classes = 'aside';
  if (exit) classes += ' aside--out';
  if (className) classes += ` ${className}`;

  if (isFullscreen) return (
    <Modal onClose={toggleFullscreen} stopScrollPropagation>
      <div className="modal__box aside-modal__box">
        <div className="modal__body aside-modal__body">
          <i className="fa fa-times aside-modal__close" onClick={toggleFullscreen} />
          <div className="aside-modal__columns">
            <div className="aside-modal__column aside-modal__column--content">
              <header className="modal__header aside-modal__header">
                {header}
              </header>
              <ScrollArea
               vertical
               smoothScrolling
               className="aside__scrollarea aside-modal__scrollarea--content"
               contentClassName="aside__scrollable"
              >
                {fullscreenContent}
              </ScrollArea>
            </div>
            <div className="aside-modal__column aside-modal__column--gallery">
              <ScrollArea
                vertical
                smoothScrolling
                className="aside__scrollarea"
                contentClassName="aside__scrollable"
              >
                {fullscreenGallery}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <React.Fragment>
      <div className="aside__shadow" onClick={onBack} />
      <div className={classes} onWheel={onWheel}>
        <div className="aside__container ">
          <header className="aside__header">
            <div className="aside__controls">
              <Link to="/" className="aside__back" onClick={onBack}>
                <div className="aside__back-text">{t('common.back')}</div>
                <i className="fa fa-chevron-right aside__back-icon" />
              </Link>
              <div className="aside__fullscreen" onClick={toggleFullscreen}>{t('aside.fullscreen')}</div>
            </div>
            {header}
          </header>
          <div className="aside__body">
            <ScrollArea
              vertical
              smoothScrolling
              className="aside__scrollarea"
              contentClassName="aside__scrollable"
            >
              <div className="aside__content">
                {children}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Aside;
