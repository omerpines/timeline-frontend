import { useCallback, useRef, useEffect } from 'react';

const useDrag = (ref, min, max, onChangeCurrent) => {
  let isDragged = useRef(false);

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

  useEffect(() => {
    const onOutOfBounds = () => isDragged.current = false;
    window.addEventListener('mouseup', onOutOfBounds);
    return () => window.removeEventListener('mouseup', onOutOfBounds);
  }, []);

  return [onDragStart, onDrag, onDragEnd];
};

export default useDrag;
