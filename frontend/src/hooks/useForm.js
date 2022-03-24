import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';

const useForm = (
  selector,
  resetActionCreator,
  updateActionCreator,
  fetchActionCreator,
  addActionCreator,
  editActionCreator,
  id,
  notFirstStep,
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useSelector(selector);

  const onChange = useCallback((name, value) => {
    dispatch(updateActionCreator(name, value));
  }, [dispatch]);

  const onChangeRelations = useCallback((name, value) => {
    const ids = state[name];
    if (ids.indexOf(value) >= 0) return;

    dispatch(updateActionCreator(name, [...ids, value]));
  }, [state]);

  const onSubmit = useCallback(() => {
    if (id) dispatch(editActionCreator(id, state));
    else dispatch(addActionCreator(state));
    navigate(-1);
  }, [state, id]);

  useEffect(() => {
    if (notFirstStep) return;
    if (id) dispatch(fetchActionCreator(id));
    else dispatch(resetActionCreator());
  }, []);

  return [state, onChange, onSubmit, onChangeRelations];
};

export default useForm;
