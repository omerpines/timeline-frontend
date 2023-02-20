import { useCallback, useRef, useEffect } from 'react';
import config from 'constants/config';

const useDrag = (ref, min, max, onChangeCurrent) => {
  let isDragged = useRef(false);
  let isTimelineDragged = useRef(false);
  let startTouch = useRef(0);

  const onDragStart = useCallback(e => {
    if (!ref.current) return;
    isDragged.current = true;
    const { height } = ref.current.getBoundingClientRect();
    const { clientY } = e;
    isTimelineDragged.current = height - clientY <= config.TIMELINE_HEIGHT;
  }, []);

  const onDrag = useCallback(e => {
    if (!isDragged.current || !ref.current || !e.movementX) return;

    e.stopPropagation();

    const range = max - min;
    const { width } = ref.current.getBoundingClientRect();

    const yearCost = width / range * -1;
    let yearDelta = e.movementX * -1 / yearCost;
    if (isTimelineDragged.current) yearDelta *= config.BOTTOM_RATIO;

    onChangeCurrent(yearDelta);
  }, [min, max, onChangeCurrent]);

  const onDragEnd = useCallback(() => {
    isDragged.current = false;
    isTimelineDragged.current = false;
  }, []);

  const onDragTouchStart = useCallback(e => {
    if (!ref.current) return;
    isDragged.current = true;
    startTouch.current = e.targetTouches[0].screenX;

    const { height } = ref.current.getBoundingClientRect();
    const { screenY } = e.targetTouches[0];
    isTimelineDragged.current = height - screenY <= config.TIMELINE_HEIGHT;
  }, []);

  const onDragTouch = useCallback(e => {
    if (!isDragged.current || !ref.current) return;
    
    e.stopPropagation();

    const range = max - min;
    const { width } = ref.current.getBoundingClientRect();
    
    const yearCost = width / range * config.MOBILE_DRAG_SLOWDOWN * -1;
    const screenDelta = e.targetTouches[0].screenX - startTouch.current;
    let yearDelta = screenDelta * -1 / yearCost;
    if (isTimelineDragged.current) yearDelta *= config.BOTTOM_RATIO;

    onChangeCurrent(yearDelta);
  }, [min, max, onChangeCurrent]);

  const onDragTouchEnd = onDragEnd;

  useEffect(() => {
    const onOutOfBounds = () => isDragged.current = false;
    window.addEventListener('mouseup', onOutOfBounds);
    return () => window.removeEventListener('mouseup', onOutOfBounds);
  }, []);

  return [onDragStart, onDrag, onDragEnd, onDragTouchStart, onDragTouch, onDragTouchEnd];
};

export default useDrag;
