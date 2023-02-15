import React, { useMemo } from 'react';
import useTimelineGroupHover from 'hooks/useTimelineGroupHover';
import './style.css';

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
}) => {
  const [hovered, onmouseenter, onmouseleave] = useTimelineGroupHover();

  const styles = useMemo(() => {
    const yearCost = width / (max - min);
    const length = endDate - fromDate + 1;
    const start = Math.floor(yearCost * (fromDate - min));
    return {
      width: Math.round(yearCost * length),
      transform: `translateX(${start * -1}px)`,
    };
  }, [width, data, endDate, fromDate, min, max]);

  let classes = 'timeline-group';
  if (className) classes += ` ${className}`;

  let visibleClasses = 'timeline-group__visible';
  if (visibleClassName) visibleClasses += ` ${visibleClassName}`;

  if (!data.length) return false;

  return (
    <div
      className={classes}
      style={styles}
      onMouseEnter={onmouseenter}
      onMouseLeave={onmouseleave}
    >
      <div className={visibleClasses}>
        {visibleContent}
      </div>
      {hovered && (
        <React.Fragment>
          {renderTooltip()}
          <div className="timeline-group__hover-bridge" />
        </React.Fragment>
      )}
    </div>
  );
};

export default TimelineGroup;
