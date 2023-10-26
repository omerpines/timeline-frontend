import types from 'store/actionTypes';

export const uploadCSV = (content, type) => ({
  type: types.CSV_UPLOAD,
  csvType: type,
  content,
});

export const downloadCSV = (content, type) => ({
  type: types.CSV_DOWNLOAD,
  csvType: type,
  content,
});

export const failureCSV = errors => ({
  type: types.CSV_FAILURE,
  errors,
});

export const loadingCSV = () => ({
  type: types.CSV_LOADING,
});

export const successCSV = () => ({
  type: types.CSV_SUCCESS,
});

export const resetCSV = () => ({
  type: types.CSV_RESET,
});
