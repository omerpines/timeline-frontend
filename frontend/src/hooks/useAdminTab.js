import { useState, useCallback } from 'react';

const useAdminTab = () => {
  const [showMedia, setShowMedia] = useState(false);

  const moveToMedia = useCallback(() => {
    setShowMedia(true);
  }, []);

  const moveToForm = useCallback(() => {
    setShowMedia(false);
  }, []);

  return [showMedia, moveToForm, moveToMedia];
};

export default useAdminTab;
