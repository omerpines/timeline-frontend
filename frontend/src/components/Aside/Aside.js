import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollArea from 'react-scrollbar/dist/no-css';
import './style.scss';

const Aside = ({ children, header, className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [exit, setExit] = useState(false);

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
      if (exit) navigate('/');
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

  return (
    <React.Fragment>
      <div className="aside__shadow" />
      <div className={classes} onWheel={onWheel}>
        <div className="aside__container ">
          <header className="aside__header">
            {/* <img src='/imagePreview.png' className='img-fluid'/> */}
            <Link to="/" className="aside__back" onClick={onBack}>
              <div className="aside__back-text">{t('common.back')}</div>
              <i className="fa fa-chevron-right aside__back-icon" />
            </Link>
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
