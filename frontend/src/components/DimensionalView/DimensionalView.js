import './style.css';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { easeShare, fromRange, hexToRGBA, inRange } from 'helpers/util';

import Arrow from 'components/Arrow';
import { Bezier } from 'bezier-js/dist/bezier';
import { CSSTransition } from 'react-transition-group';
import Cluster from 'components/Cluster';
import DimensionalPeriod from 'components/DimensionalPeriod';
import { Link } from 'react-router-dom';
import StoryPreview from 'components/StoryPreview';
import YearDisplay from 'components/YearDisplay';
import config from 'constants/config';
import { getEventLink } from 'helpers/urls';
import useData from 'hooks/useData';
import useMobile from 'hooks/useMobile';

const calculatePaths = ref => {
  const domElem = ref.current;
  if (!domElem) return [null, null, null];

  const { width, height } = domElem.getBoundingClientRect();

  const firstPath = new Bezier([
    { x: -50, y: Math.round(height * 0.4)},
    { x: Math.round(width * 0.75), y: Math.round(height * 0.5)},
    { x: width + 100, y: Math.round(height * 0.92) },
    //1400 0
    // 1366 6
    // 1280 10
    // 1152 5
    // 1024 7
  ]);

  const secondPath = new Bezier([
    { x: -50, y: Math.round(height * 0.41) },
    { x: Math.round(width * 0.7), y: Math.round(height * 0.5) },
    { x: Math.round(width * 0.95), y: height + 100 },
  ]);

  const thirdPath = new Bezier([
    { x: -50, y: Math.round(height * 0.42) },
    { x: Math.round(width * 0.5), y: Math.round(height * 0.5) },
    { x: Math.round(width * 0.65), y: height + 100 +5 },
    // 1280 5
  ]);

  return [firstPath, secondPath, thirdPath];
}

const calculateRoadPaths = ref => {
  const domElem = ref.current;
  if (!domElem) return [null, null, null, null];

  const { width, height } = domElem.getBoundingClientRect();

  const firstPath = new Bezier([
    { x: -50, y: Math.round(height * 0.400) },
    { x: Math.round(width * 0.78), y: Math.round(height * 0.5) },
    { x: width + 100, y: Math.round(height * 0.8) },
  ]);

  const secondPath = new Bezier([
    { x: -50, y: Math.round(height * 0.405) },
    { x: Math.round(width * 0.725), y: Math.round(height * 0.5) },
    { x: width, y: height },
  ]);

  const thirdPath = new Bezier([
    { x: -50, y: Math.round(height * 0.415) },
    { x: Math.round(width * 0.575), y: Math.round(height * 0.5) },
    { x: Math.round(width * 0.8), y: height + 100 },
  ]);

  const fourthPath = new Bezier([
    { x: -50, y: Math.round(height * 0.425) },
    { x: Math.round(width * 0.4), y: Math.round(height * 0.5) },
    { x: Math.round(width * 0.5), y: height + 100 },
  ]);

  return [firstPath, secondPath, thirdPath, fourthPath];
}

const usePaths = ref => {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const updatePaths = () => {
      const newPaths = calculatePaths(ref);
      setPaths(newPaths);
    };

    updatePaths();

    window.addEventListener('resize', updatePaths);

    return () => window.removeEventListener('resize', updatePaths);
  }, []);

  return paths;
}

const useCanvas = (containerRef, canvasRef, data, min, max, paths, clustered) => {
  const range = max - min;
  const canvasData = useMemo(
    () => data
      .filter(dp => dp.fromDate && dp.endDate)
      .filter(dp => {
        const date = dp.endDate || dp.date;
        const position = (date - min) / range;
        const easedPosition = easeShare(1 - position);
        if (easedPosition > 0.35 && easedPosition <= 0.7 && clustered.length) return false;
        return true;
      }),
    [data, min, max, clustered],
  );

  const repaint = useCallback(() => {
    if (!canvasRef.current || !paths[0]) return;
    const canvas = canvasRef.current;
    const { width, height } = canvas;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    canvasData.forEach(dp => {
      const endShare = easeShare(1 - fromRange(min, max, dp.fromDate));
      const fromShare = easeShare(1 - fromRange(min, max, dp.endDate));
      const path = paths[dp.path - 1];
      const curve = path.split(fromShare, endShare);

      if (!curve.points || !curve.points[2].x || !curve.points[2].y || !curve.points[0].x || !curve.points[0].y) return;

      const color = ctx.createLinearGradient(
        inRange(0, width, curve.points[0].x),
        inRange(0, height, curve.points[0].y),
        inRange(0, width, curve.points[2].x),
        inRange(0, height, curve.points[2].y),
      );
      color.addColorStop(0, dp.color);
      color.addColorStop(1, hexToRGBA(dp.color, 0));

      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = 5;
      ctx.moveTo(curve.points[0].x, curve.points[0].y);
      ctx.quadraticCurveTo(curve.points[1].x, curve.points[1].y, curve.points[2].x, curve.points[2].y);
      ctx.stroke();
    });
  }, [canvasData, min, max, paths]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;

    const resize = () => {
      if (!containerRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      if (width === canvasWidth && height === canvasHeight) return;

      canvas.width = width;
      canvas.height = height;
      repaint();
    }

    resize();

    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, [repaint]);
};

const useRoad = (containerRef, roadRef, paths) => {
  useEffect(() => {
    if (!containerRef.current || !roadRef.current || !paths[0]) return;
    const canvas = roadRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      if (!containerRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    }

    resize();

    window.addEventListener('resize', resize);

    // paths.forEach(p => {
    //   ctx.beginPath();
    //   ctx.lineCap = 'round';
    //   ctx.lineWidth = 3;
    //   ctx.moveTo(p.points[0].x, p.points[0].y);
    //   ctx.quadraticCurveTo(p.points[1].x, p.points[1].y, p.points[2].x, p.points[2].y);
    //   ctx.stroke();
    // });

    const roadPaths = calculateRoadPaths(containerRef);

    roadPaths.forEach(p => {
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#fff';
      ctx.moveTo(p.points[0].x, p.points[0].y);
      ctx.quadraticCurveTo(p.points[1].x, p.points[1].y, p.points[2].x, p.points[2].y);
      ctx.stroke();
    });

    const [rp1, rp2, rp3, rp4] = roadPaths;

    const grad1 = ctx.createLinearGradient(rp1.points[0].x, rp1.points[0].y, rp1.points[2].x, rp1.points[2].y);
    grad1.addColorStop(0, '#704e4f');
    grad1.addColorStop(1, '#DC1F57');

    ctx.beginPath();
    ctx.fillStyle = grad1;
    ctx.strokeStyle = grad1;
    ctx.lineWidth = 2;
    ctx.moveTo(rp1.points[0].x, rp1.points[0].y);
    ctx.quadraticCurveTo(rp1.points[1].x, rp1.points[1].y, rp1.points[2].x, rp1.points[2].y);
    ctx.lineTo(rp2.points[2].x, rp2.points[2].y);
    ctx.quadraticCurveTo(rp2.points[1].x, rp2.points[1].y, rp2.points[0].x, rp2.points[0].y);
    ctx.lineTo(rp1.points[0].x, rp1.points[0].y);
    ctx.fill();
    ctx.stroke();

    const grad2 = ctx.createLinearGradient(rp2.points[0].x, rp2.points[0].y, rp2.points[2].x, rp2.points[2].y);
    grad2.addColorStop(0, '#836648');
    grad2.addColorStop(1, '#e8963a');

    ctx.beginPath();
    ctx.fillStyle = grad2;
    ctx.strokeStyle = grad2;
    ctx.lineWidth = 2;
    ctx.moveTo(rp2.points[0].x, rp2.points[0].y);
    ctx.quadraticCurveTo(rp2.points[1].x, rp2.points[1].y, rp2.points[2].x, rp2.points[2].y);
    ctx.lineTo(rp3.points[2].x - 2, rp3.points[2].y);
    ctx.quadraticCurveTo(rp3.points[1].x, rp3.points[1].y, rp3.points[0].x, rp3.points[0].y);
    ctx.lineTo(rp2.points[0].x, rp2.points[0].y);
    ctx.fill();
    ctx.stroke();

    const grad3 = ctx.createLinearGradient(rp3.points[0].x, rp3.points[0].y, rp3.points[2].x, rp3.points[2].y);
    grad3.addColorStop(0, '#4d6271');
    grad3.addColorStop(1, '#40799c');

    ctx.beginPath();
    ctx.fillStyle = grad3;
    ctx.strokeStyle = grad3;
    ctx.moveTo(rp3.points[0].x, rp3.points[0].y);
    ctx.quadraticCurveTo(rp3.points[1].x, rp3.points[1].y, rp3.points[2].x, rp3.points[2].y);
    ctx.lineTo(rp4.points[2].x - 2, rp4.points[2].y);
    ctx.quadraticCurveTo(rp4.points[1].x, rp4.points[1].y, rp4.points[0].x, rp4.points[0].y);
    ctx.lineTo(rp3.points[0].x, rp3.points[0].y);
    ctx.fill();
    ctx.stroke();

    const grad4 = ctx.createLinearGradient(rp3.points[0].x, rp3.points[0].y, rp3.points[2].x, rp3.points[2].y);
    grad4.addColorStop(0, '#4e718b');
    grad4.addColorStop(1, '#2382b1');

    ctx.beginPath();
    ctx.fillStyle = grad4;
    ctx.strokeStyle = grad4;
    ctx.moveTo(rp4.points[0].x, rp4.points[0].y + 3);
    ctx.quadraticCurveTo(rp4.points[1].x - 4, rp4.points[1].y + 4, rp4.points[2].x - 8, rp4.points[2].y);
    ctx.lineTo(rp4.points[2].x, rp4.points[2].y);
    ctx.quadraticCurveTo(rp4.points[1].x, rp4.points[1].y, rp4.points[0].x, rp4.points[0].y);
    ctx.lineTo(rp4.points[0].x, rp4.points[0].y + 3);
    ctx.fill();
    ctx.stroke();

    const grad5 = ctx.createLinearGradient(rp4.points[0].x, rp4.points[0].y, rp4.points[2].x, rp4.points[2].y);
    grad5.addColorStop(0, '#458fbb00');
    grad5.addColorStop(1, '#458fbb');

    ctx.beginPath();
    ctx.strokeStyle = grad5;
    ctx.moveTo(rp4.points[0].x, rp4.points[0].y);
    ctx.quadraticCurveTo(rp4.points[1].x, rp4.points[1].y, rp4.points[2].x, rp4.points[2].y);
    ctx.stroke();

    ctx.globalAlpha = 1;

    return () => window.removeEventListener('resize', resize);
  }, [paths]);
};

const renderDataPoint = (characters, paths, min, range, clustered, earliest) => data => {
  if (!paths[0]) return false;

  const path = paths[data.path - 1];

  const date = data.endDate || data.date;

  const position = (date - min) / range >= 1? 1 : (date - min) / range <= 0? 0 :(date-min)/range;
  const easedPosition = easeShare(1 - position);

  const { x, y } = path.get(easedPosition);

  const [minScale, maxScale] = config.PATH_SCALING[data.path];
  const scale = easedPosition * (maxScale - minScale) + minScale;

  let size = 'small';
  if (easedPosition > 0.25) size = 'medium';
  if (easedPosition > 0.35) size = 'cluster';
  if (easedPosition > 0.7) size = 'big';

  const previewOpacity = easedPosition + 0.5;

  if (size === 'cluster' && clustered.length) return false;
  if (size === 'cluster') size = 'medium';

  const styles = {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
    backgroundColor: data.color,
    zIndex: 9999999 - data.endDate,
  };

  const previewStyles = {
    // left: x,
    // top: y,
    transform: `translate(${x}px, ${y}px)`,
  };
  
  return (
    <React.Fragment key={data.id}>
      <li style={styles} className={`dimensional__item dimensional__item--path-${data.path}`}>
        <Link to={getEventLink(data.id)} className="dimensional__item-link" />
      </li>
      {easedPosition > 0.1 && (
        <StoryPreview
          characters={characters}
          size={size}
          data={data}
          opacity={previewOpacity}
          styles={previewStyles}
          hoverable={earliest.id === data.id}
        />
      )}
    </React.Fragment>
  );
}

const renderPeriod = (min, range) => period => (
  <DimensionalPeriod data={period} min={min} range={range} key={period.id} />
);

const emptyArray = [];

const DimensionalView = ({ data, min, max, onZoom, children }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const roadRef = useRef(null);
  const focusPointRef = useRef(null);
  const isMobile = useMobile();

  const { characters, periods } = useData();

  const [clustered, setClustered] = useState(emptyArray);
  const [visibleClustered, setVisibleClustered] = useState(emptyArray);

  // console.log('DimensionalView=>', data)

  const paths = usePaths(containerRef);
  useCanvas(containerRef, canvasRef, data, min, max, paths, clustered);
  useRoad(containerRef, roadRef, paths);

  useEffect(() => {
    let timeoutHandle = null;

    const temp = [];
    const range = max - min;
    data.forEach(d => {
      const date = d.endDate || d.date;
      const position = (date - min) / range;
      const easedPosition = easeShare(1 - position);
      if (easedPosition > 0.35 && easedPosition <= 0.7) temp.push(d);
    });

    if (temp.length > config.CLUSTER_TRESHOLD) {
      setClustered(temp);
      setVisibleClustered(temp);
    } else {
      setClustered(emptyArray);
      timeoutHandle = setTimeout(() => setVisibleClustered(emptyArray), 200);
    }

    return () => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    };
  }, [min, max]);

  const [focusPointerStyle, setFocusPointerStyle] = useState({top:0, left:0});
  const [focusPointerStyleYear, setFocusPointerStyleYear] = useState({top:0, left:0});
  const [focusPointerStyleArrow, setFocusPointerStyleArrow] = useState({top:0, left:0});

  const repaintFocusRef = useCallback(() => {
    if (!focusPointRef.current || !paths || !paths[0]) return false;

    const ctx = focusPointRef.current.getContext('2d');
    const points = paths.map(p => p.get(easeShare(1 - config.FOCUS_POINT / 100)));
    const curve = Bezier.quadraticFromPoints(points[0], points[1], points[2]);
    
    const start = curve.get(-0.25);
    const end = curve.get(1.19);
    
    const grad = ctx.createLinearGradient(end.x, end.y, start.x, start.y);
    grad.addColorStop(0, '#DC1F57');
    grad.addColorStop(1, '#FFFFFF40');

    ctx.imageSmoothingEnabled = true;

    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = grad;
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(curve.points[1].x, curve.points[1].y, end.x, end.y);
    ctx.stroke();

    return end;
  }, [paths, config.FOCUS_POINT]);

  useEffect(() => {
    if (!focusPointRef.current || !containerRef.current) return;
    const canvas = focusPointRef.current;

    const resize = () => {
      if (!focusPointRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const { x, y } = repaintFocusRef();

      if (!isMobile) {
        setFocusPointerStyle({
          top: y,
          left: x,
        });
        setFocusPointerStyleYear({
          top: y,
          left: x - 9,
        });
        setFocusPointerStyleArrow({
          top: y,
          left: x + 9,
        });
      } else {
        setFocusPointerStyle({
          top: y,
          left: x,
        });
        setFocusPointerStyleYear({
          top: y,
          left: x,
        });
        setFocusPointerStyleArrow({
          top: y,
          left: x,
        });
      }
    }

    resize();

    // window.addEventListener('resize', resize);

    // return () => window.removeEventListener('resize', resize);
  }, [repaintFocusRef]);

  const earliestPoint = useMemo(() => {
    return data.reduce((a, b) => {
      if (!a) return b;
      if (b.endDate > a.endDate) return a;
      return b;
    }, null);
  }, [data]);

  const RightArrow = ({ className, angle, style, yAngle }) => {
  
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
      <div className={className} style={styles}>
        <div className="arrow-right" />
      </div>
    );
  };
  const RightArrow1 = ({ className, angle, style, yAngle }) => {
  
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
      <div className={className} style={styles}>
        <div className="arrow-right1" />
      </div>
    );
  };

  return (
    <div className="dimensional">
      <canvas className="dimensional__canvas dimensional__canvas--road" ref={roadRef} style={{ transform: 'translate(0.5, 0.5)' }} />
      {periods.map(renderPeriod(min, max - min))}
      <canvas className="dimensional__canvas1" ref={focusPointRef} />
      <RightArrow1 angle={-0.0001} yAngle={20} style={focusPointerStyle} className="dimensional__focus-arrow1" />
      <YearDisplay
        className="dimensional__focus-year"
        min={min}
        max={max}
        angle={-0.0001}
        yAngle={30}
        style={focusPointerStyleYear}
      />
      <RightArrow angle={-0.0001} yAngle={20} style={focusPointerStyleArrow} className="dimensional__focus-arrow" />

      <ul
        className="dimensional__nodes"
        ref={containerRef}
      >
        {data.map(renderDataPoint(characters, paths, min, max - min, clustered, earliestPoint))}
      </ul>
      <CSSTransition in={!!clustered.length} timeout={200} classNames="dimensional__cluster" appear>
        <div className="dimensional__cluster">
          <Cluster data={visibleClustered} onZoom={onZoom} />
        </div>
      </CSSTransition>
      {children}
    </div>
  );
};

export default DimensionalView;
