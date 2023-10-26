import { useCallback, useState } from 'react';

const useTimelineGroupHover = () => {
  const [hovered, setHovered] = useState(false);

  const onmouseenter = useCallback(() => {
    if (!hovered) {
      setHovered(true);
    }
    // else setHovered(false);
  }, [hovered]);

  const onmouseleave = useCallback(e => {
    if (hovered) {
      setHovered(false);
    }
  }, [hovered]);


  window.addEventListener('message', function (event) {
    setHovered(false);
  });

  return [hovered, onmouseenter, onmouseleave];
};

export default useTimelineGroupHover;
