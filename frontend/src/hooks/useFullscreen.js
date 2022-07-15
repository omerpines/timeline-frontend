import { useState, useCallback } from 'react';

const useFullscreen = () => {
  const [isFullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setFullscreen(f => !f);
  }, []);

  return [isFullscreen, toggleFullscreen];
};

export default useFullscreen;
