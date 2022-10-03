import React from 'react';
import Arrow from 'components/Arrow';
import config from 'constants/config';
import './style.css';

const style = {
  right: `${config.FOCUS_POINT}%`,
};

const TimelineFocusPoint = () => {
  return (
    <div className="timeline-focus" style={style}>
      <Arrow className="timeline-focus__pointer" />
    </div>
  );
};

export default TimelineFocusPoint;
