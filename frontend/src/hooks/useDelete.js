import { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import AdminDeleteModal from 'components/AdminDeleteModal';

const useDelete = actionCreator => {
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(null);

  const onRequestDelete = useCallback(e => {
    setDeleteId(e.currentTarget.dataset.id);
  }, []);

  const onConfirmDelete = useCallback((e) => {
    if (deleteId) {
      dispatch(actionCreator(deleteId));
      setDeleteId(null);
    }
  }, [deleteId]);

  const onCancelDelete = useCallback(() => {
    setDeleteId(null);
  }, []);

  const deleteModal = useMemo(() => {
    if (!deleteId) return false;
    return (
      <AdminDeleteModal onConfirm={onConfirmDelete} onClose={onCancelDelete} />
    );
  }, [deleteId, onConfirmDelete, onCancelDelete]);

  return [deleteModal, onRequestDelete];
};

export default useDelete;
