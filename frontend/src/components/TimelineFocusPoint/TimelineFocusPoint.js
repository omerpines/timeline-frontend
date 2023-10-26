import React from 'react';
import Arrow from 'components/Arrow';
import config from 'constants/config';
import YearDisplay from 'components/YearDisplay';
import './style.css';

const style = {
  right: `${config.FOCUS_POINT}%`,
};

const TimelineFocusPoint = ({min, max}) => {

  const RightArrow = ({className}) => {
    return (
      <div className={className}>
        <div className="arrow-down" />
      </div>
    );
  };

  return (
    <div className="timeline-focus" style={style}>
      <YearDisplay
        className="timeline-focus__year"
        min={min}
        max={max}
      />
      <RightArrow className="timeline-focus__arrow" />
      <Arrow className="timeline-focus__pointer" />
    </div>
  );
};

export default TimelineFocusPoint;
