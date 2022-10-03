import React, { useMemo } from 'react';
import './style.css';

const Arrow = ({ className, angle, style, yAngle }) => {
  let classes = 'arrow';
  if (className) classes += ` ${className}`;

  const styles = useMemo(() => {
    if (!angle) return undefined;

    const transform = yAngle ? `rotate(${angle}deg) rotateY(${yAngle}deg)` : `rotate(${angle}deg)`;

    if (style) return {
      ...style,
      transform,
    };

    return { transform };
  }, [angle, yAngle, style]);

  return (
    <div className={classes} style={styles}>
      <div className="arrow__inner" />
    </div>
  );
};

export default Arrow;
