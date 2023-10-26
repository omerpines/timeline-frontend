import React, { useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { parse } from 'csv-parse/dist/esm/sync';
import { uploadCSV, resetCSV } from 'store/actionCreators/csv';
import { isCSVLoading, isCSVSucceed, getCSVErrors } from 'store/selectors/csv';
import useGetCSV from 'hooks/useGetCSV';
import { coordsToExcel } from 'helpers/csv';
import './style.css';

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsText(file, 'UTF-8');
  })
}

function containsSpecialCharactersOrQuotes(cell) {
  return /[,"\n\r]/.test(cell);
}

function arrayToCSV(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return "";
  }

  const columns = Object.keys(data[0]);
  const header = columns.join(",") + "\n";

  const rows = data.map(item => {
    return columns.map(column => {
      return containsSpecialCharactersOrQuotes(item[column])? `"${item[column].replace(/"/g, '""')}"` : item[column];
    }).join(",");
  });

  return header + rows.join("\n");
}

function writeFileAsyncCSV(content, filename) {
  const csvContent = "\uFEFF" + arrayToCSV(content);

  const blob = new Blob([csvContent], { type: "text/csv; charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename + '.csv';
  downloadLink.textContent = "Download CSV";

  document.body.appendChild(downloadLink);
  downloadLink.click();

  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}


const renderCSVError = t => ([x, y, error]) => {
  const cell = coordsToExcel(x, y);
  return (
    <li className="admin-page-title__csv-errors__error" key={`${x}${y}`}>
      {cell}: {t(error)}
    </li>
  );
};

const AdminPageTitle = ({ addTo, title, addTitle, onClickAdd, csvType, className }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const content = useGetCSV(csvType);

  const csvupRef = useRef(null);

  const csvLoading = useSelector(isCSVLoading);
  const csvSuccess = useSelector(isCSVSucceed);
  const csvErrors = useSelector(getCSVErrors);

  const onClickUpCSV = useCallback(() => {
    dispatch(resetCSV());
    if (csvupRef.current) csvupRef.current.click();
  }, []);

  const onClickDownCSV = useCallback(() => {
    writeFileAsyncCSV(content, csvType);
  }, [csvType]);

  const onChangeCSV = useCallback(async () => {
    if (!csvupRef.current) return;
    if (!csvupRef.current.files) return;
    const file = await readFileAsync(csvupRef.current.files[0]);
    const parsed = parse(file);
    dispatch(uploadCSV(parsed, csvType));
    csvupRef.current.value = null;
  }, [csvType]);

  useEffect(() => {
    dispatch(resetCSV());
  }, []);

  let classes = "admin-page-title";
  if (className) classes += ` ${className}`;

  return (
    <React.Fragment>
      <header className={classes}>
        <div className="admin-page-title__title">{t(title)}</div>
        <div className="admin-page-title__buttons">
          <Link className="admin-page-title__add admin-page-title__add-csv" to="#" onClick={onClickDownCSV}>
            <span className="admin-page-title__add-icon"><i className="fa fa-table" /></span>
            <span className="admin-page-title__add-text">{t('Download')}</span>
          </Link>
          <Link className="admin-page-title__add admin-page-title__add-csv" to="#" onClick={onClickUpCSV}>
            <span className="admin-page-title__add-icon"><i className="fa fa-table" /></span>
            <span className="admin-page-title__add-text">{t('Upload')}</span>
          </Link>
          <input type="file" className="admin-page-title__csv" ref={csvupRef} accept=".csv" onChange={onChangeCSV} />
          <Link className="admin-page-title__add" to={addTo || '#'} onClick={onClickAdd}>
            <span className="admin-page-title__add-icon">+</span>
            <span className="admin-page-title__add-text">{t(addTitle)}</span>
          </Link>
        </div>
      </header>
      {csvLoading || csvSuccess || csvErrors.length > 0 ? (
        <div className="admin-page-title__csv-info">
          {csvSuccess && <div className="admin-page-title__csv-success">{t('csv.success')}</div>}
          {csvErrors.length > 0 && (
            <div className="admin-page-title__csv-errors">
              <div className="admin-page-title__csv-errors__title">{t('csv.errors')}</div>
              <ul className="admin-page-title__csv-errors__list">
                {csvErrors.map(renderCSVError(t))}
              </ul>
            </div>
          )}
        </div>
      ) : false}
    </React.Fragment>
  );
};

export default AdminPageTitle;
