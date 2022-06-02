import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bezier} from 'bezier-js/dist/bezier';
import StoryPreview from 'components/StoryPreview';
import DimensionalPeriod from 'components/DimensionalPeriod';
import useData from 'hooks/useData';
import useDrag from 'hooks/useDrag';
import config from 'constants/config';
import { fromRange, inRange, easeShare, hexToRGBA } from 'helpers/util';
import { getEventLink } from 'helpers/urls';
import './style.css';

const calculatePaths = ref => {
  const domElem = ref.current;
  if (!domElem) return [null, null, null];

  const { width, height } = domElem.getBoundingClientRect();

  const firstPath = new Bezier([
    { x: -50, y: Math.round(height * 0.4) },
    { x: Math.round(width * 0.75), y: Math.round(height * 0.5)},
    { x: width + 100, y: Math.round(height * 0.92) },
  ]);

  const secondPath = new Bezier([
    { x: -50, y: Math.round(height * 0.41) },
    { x: Math.round(width * 0.7), y: Math.round(height * 0.5) },
    { x: Math.round(width * 0.95), y: height + 100 },
  ]);

  const thirdPath = new Bezier([
    { x: -50, y: Math.round(height * 0.42) },
    { x: Math.round(width * 0.5), y: Math.round(height * 0.5) },
    { x: Math.round(width * 0.65), y: height + 100 },
  ]);

  return [firstPath, secondPath, thirdPath];
}

const calculateRoadPaths = ref => {
  const domElem = ref.current;
  if (!domElem) return [null, null, null, null];

  const { width, height } = domElem.getBoundingClientRect();

  const firstPath = new Bezier([
    { x: -50, y: Math.round(height * 0.4) },
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
  const [p1, setP1] = useState(null);
  const [p2, setP2] = useState(null);
  const [p3, setP3] = useState(null);

  useEffect(() => {
    const updatePaths = () => {
      const [newP1, newP2, newP3] = calculatePaths(ref);
      setP1(newP1);
      setP2(newP2);
      setP3(newP3);
    };

    updatePaths();

    window.addEventListener('resize', updatePaths);

    return () => window.removeEventListener('resize', updatePaths);
  }, []);

  return [p1, p2, p3];
}

const useCanvas = (containerRef, canvasRef, data, min, max, paths) => {
  const canvasData = useMemo(() => data.filter(dp => dp.fromDate && dp.endDate), [data]);

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

    // roadPaths.forEach(p => {
    //   ctx.beginPath();
    //   ctx.lineCap = 'round';
    //   ctx.lineWidth = 1;
    //   ctx.strokeStyle = '#fff';
    //   ctx.moveTo(p.points[0].x, p.points[0].y);
    //   ctx.quadraticCurveTo(p.points[1].x, p.points[1].y, p.points[2].x, p.points[2].y);
    //   ctx.stroke();
    // });

    const [rp1, rp2, rp3, rp4] = roadPaths;
    ctx.globalAlpha = 0.5;

    ctx.beginPath();
    ctx.fillStyle = '#DE8909';
    ctx.strokeStyle = '#DE8909';
    ctx.lineWidth = 2;
    ctx.moveTo(rp1.points[0].x, rp1.points[0].y);
    ctx.quadraticCurveTo(rp1.points[1].x, rp1.points[1].y, rp1.points[2].x, rp1.points[2].y);
    ctx.lineTo(rp2.points[2].x, rp2.points[2].y);
    ctx.quadraticCurveTo(rp2.points[1].x, rp2.points[1].y, rp2.points[0].x, rp2.points[0].y);
    ctx.lineTo(rp1.points[0].x, rp1.points[0].y);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = '#DC1F57';
    ctx.strokeStyle = '#DC1F57';
    ctx.lineWidth = 2;
    ctx.moveTo(rp2.points[0].x, rp2.points[0].y);
    ctx.quadraticCurveTo(rp2.points[1].x, rp2.points[1].y, rp2.points[2].x, rp2.points[2].y);
    ctx.lineTo(rp3.points[2].x - 2, rp3.points[2].y);
    ctx.quadraticCurveTo(rp3.points[1].x, rp3.points[1].y, rp3.points[0].x, rp3.points[0].y);
    ctx.lineTo(rp2.points[0].x, rp2.points[0].y);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = '#0F739E';
    ctx.strokeStyle = '#0F739E';
    ctx.moveTo(rp3.points[0].x, rp3.points[0].y);
    ctx.quadraticCurveTo(rp3.points[1].x, rp3.points[1].y, rp3.points[2].x, rp3.points[2].y);
    ctx.lineTo(rp4.points[2].x - 2, rp4.points[2].y);
    ctx.quadraticCurveTo(rp4.points[1].x, rp4.points[1].y, rp4.points[0].x, rp4.points[0].y);
    ctx.lineTo(rp3.points[0].x, rp3.points[0].y);
    ctx.fill();
    ctx.stroke();

    ctx.globalAlpha = 1;

    return () => window.removeEventListener('resize', resize);
  }, [paths]);
};

const renderDataPoint = (characters, paths, min, range) => data => {
  if (!paths[0]) return false;

  const path = paths[data.path - 1];

  const date = data.endDate || data.date;

  const position = (date - min) / range;
  const easedPosition = easeShare(1 - position);

  const { x, y } = path.get(easedPosition);

  const [minScale, maxScale] = config.PATH_SCALING[data.path];
  const scale = easedPosition * (maxScale - minScale) + minScale;

  let size = 'small';
  if (easedPosition > 0.5) size = 'medium';

  const previewOpacity = easedPosition + 0.5;

  const styles = {
    left: x,
    top: y,
    transform: `scale(${scale})`,
    backgroundColor: data.color,
  };

  const previewStyles = {
    left: x,
    top: y,
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
        />
      )}
    </React.Fragment>
  );
}

const renderPeriod = (min, range) => period => (
  <DimensionalPeriod data={period} min={min} range={range} key={period.id} />
);

const DimensionalView = ({ data, min, max, onChangeCurrent, children }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const roadRef = useRef(null);

  const { characters, periods } = useData();

  const paths = usePaths(containerRef);
  const [onDragStart, onDrag, onDragEnd] = useDrag(containerRef, min, max, onChangeCurrent);
  useCanvas(containerRef, canvasRef, data, min, max, paths);
  useRoad(containerRef, roadRef, paths);

  return (
    <div className="dimensional">
      <canvas className="dimensional__canvas dimensional__canvas--road" ref={roadRef} style={{ transform: 'translate(0.5, 0.5)' }} />
      {periods.map(renderPeriod(min, max - min))}
      <ul
        className="dimensional__nodes"
        ref={containerRef}
        onMouseDown={onDragStart}
        onMouseMove={onDrag}
        onMouseUp={onDragEnd}
      >
        {data.map(renderDataPoint(characters, paths, min, max - min))}
      </ul>
      <canvas className="dimensional__canvas" ref={canvasRef} />
      {children}
    </div>
  );
};

export default DimensionalView;
