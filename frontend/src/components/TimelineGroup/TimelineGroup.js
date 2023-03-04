import React, { useMemo, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import useTimelineGroupHover from 'hooks/useTimelineGroupHover';
import config from 'constants/config';
import { inRange } from 'helpers/util';
import './style.css';

const emptyStyles = {};

const TimelineGroup = ({
  data,
  fromDate,
  endDate,
  min,
  max,
  width,
  className,
  visibleClassName,
  visibleContent,
  renderTooltip,
  tooltipClassName,
  linkFn,
}) => {
  const [hovered, onmouseenter, onmouseleave] = useTimelineGroupHover();

  const [groupShift, groupWidth, styles] = useMemo(() => {
    const yearCost = width / (max - min);
    const length = endDate - fromDate + 1;
    const start = Math.floor(yearCost * (fromDate - min));
    const newWidth = Math.round(yearCost * length);
    return [
      start,
      newWidth,
      {
        width: newWidth,
        transform: `translateX(${start * -1}px)`,
      },
    ];
  }, [width, data, endDate, fromDate, min, max]);

  let classes = 'timeline-group';
  if (className) classes += ` ${className}`;
  if (hovered) classes += ' timeline-group--hovered';

  let visibleClasses = 'timeline-group__visible';
  if (visibleClassName) visibleClasses += ` ${visibleClassName}`;
  if (data.length === 1) visibleClasses += ' timeline-group__visible--link timeline-group__visible--singular';
  if (hovered) visibleClasses += ' timeline-group__visible--hovered';

  const hoverRef = useRef(null);
  const [hoverStyles, setHoverStyles] = useState(emptyStyles);

  const calculateHoverStyles = useCallback(() => {
    if (!hovered || !hoverRef.current) return emptyStyles;

    const refRect = hoverRef.current.getBoundingClientRect();
    const refWidth = refRect.width;

    const leftMargin = (width - config.GROUP_HOVER_PADDING - Math.round(refWidth / 2)) * -1;
    const rightMargin = config.GROUP_HOVER_PADDING * -1 - Math.round(refWidth / 2);

    let transformShift = inRange(leftMargin, groupShift * -1 - Math.round(groupWidth / 2), rightMargin);

    setHoverStyles({
      transform: `translateX(${transformShift}px)`,
    });
  }, [hovered, groupShift, groupWidth]);

  useLayoutEffect(() => {
    calculateHoverStyles();
  }, [calculateHoverStyles]);

  const hoverRefCallback = useCallback(n => {
    if (n) {
      hoverRef.current = n;
      calculateHoverStyles();
    }
  }, [calculateHoverStyles]);

  let hoverClasses = 'timeline-group__hover-positioning';
  if (tooltipClassName) hoverClasses += ` ${tooltipClassName}`;

  const id = useMemo(() => `${fromDate}${endDate}${visibleClassName}`, [fromDate, endDate, visibleClassName]);

  if (!data.length) return false;

  if (data.length === 1) return (
    <div
      className={classes}
      style={styles}
    >
      <Link to={linkFn(data[0].id)} className={visibleClasses}>
        {visibleContent}
      </Link>
    </div>
  );

  return (
    <React.Fragment>
      <div
        className={classes}
        style={styles}
        onMouseEnter={onmouseenter}
        data-group-id={id}
      >
        <div className={visibleClasses} data-group-id={id}>
          {visibleContent}
        </div>
      </div>
      {hovered && (
        <div className={hoverClasses} style={hoverStyles} data-group-id={id}>
          {renderTooltip(id)}
          <div className="timeline-group__hover-bridge" ref={hoverRefCallback} data-group-id={id} />
        </div>
      )}
      {hovered && (
        <div className="timeline-group__hover-exit" onMouseEnter={onmouseleave} />
      )}
    </React.Fragment>
  );
};

export default TimelineGroup;
