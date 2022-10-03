import { useCallback, useRef, useEffect } from 'react';
import config from 'constants/config';

const useDrag = (ref, min, max, onChangeCurrent) => {
  let isDragged = useRef(false);
  let startTouch = useRef(0);

  const onDragStart = useCallback(() => {
    isDragged.current = true;
  }, []);

  const onDrag = useCallback(e => {
    if (!isDragged.current || !ref.current || !e.movementX) return;

    e.stopPropagation();

    const range = max - min;
    const { width } = ref.current.getBoundingClientRect();

    const yearCost = width / range * -1;
    const yearDelta = Math.round(e.movementX * -1 / yearCost);

    onChangeCurrent(yearDelta);
  }, [min, max, onChangeCurrent]);

  const onDragEnd = useCallback(() => {
    isDragged.current = false;
  }, []);

  const onDragTouchStart = useCallback(e => {
    isDragged.current = true;
    startTouch.current = e.targetTouches[0].screenX;
  }, []);

  const onDragTouch = useCallback(e => {
    if (!isDragged.current || !ref.current) return;
    
    e.stopPropagation();

    const range = max - min;
    const { width } = ref.current.getBoundingClientRect();
    
    const yearCost = width / range * config.MOBILE_DRAG_SLOWDOWN * -1;
    const screenDelta = e.targetTouches[0].screenX - startTouch.current;
    const yearDelta = Math.round(screenDelta * -1 / yearCost);
    console.log({ yearCost, range, width, screenDelta, yearDelta });

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
