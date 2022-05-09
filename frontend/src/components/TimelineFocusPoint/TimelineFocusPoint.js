import React from 'react';
import config from 'constants/config';
import './style.css';

const style = {
  right: `${config.FOCUS_POINT}%`,
};

const TimelineFocusPoint = () => {
  return (
    <div className="timeline-focus" style={style}>
      <div className="timeline-focus__pointer-box">
        <div className="timeline-focus__pointer" />
      </div>
    </div>
  );
};

export default TimelineFocusPoint;
