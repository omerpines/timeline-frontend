import moment from 'moment';

// export const formatYear = (year, t) => {
//   if (year > 100000) return t('common.dateAD', { date: year - 100000 });
//   return t('common.dateBC', { date: 100001 - year });
// };

export const formatYear = (year, t) => {
  if (year > 100000) return year - 100000;
  return (100001 - year) * -1;
}

export const renderYear = iYear => {
  if (iYear === null) return '';
  const year = parseInt(iYear, 10);
  if (year > 100000) return year - 100000;
  return (100001 - year) * -1;
}

export const parseYear = iYear => {
  const year = parseInt(iYear, 10);
  if (year === 0) return 100001;
  if (year > 0) return 100000 + year;
  return 100001 + year;
}

export const swapBeforeAfter = iYear => {
  const year = parseInt(iYear, 10);
  if (year > 100000) return 100001 - (year - 100000);
  return 100000 + (100001 - year);
}

export const isBC = iYear => {
  const year = parseInt(iYear, 10);
  return year < 100001;
};

export const compareDateStrings = (a, b) => {
  const am = moment(a);
  const bm = moment(b);
  if (am.isBefore(bm)) return 1;
  if (bm.isBefore(am)) return -1;
  return 0;
};

export const sortEntitiesByUpdatedAt = es => {
  return es.sort((a, b) => compareDateStrings(a.updatedAt, b.updatedAt));
}

export const sortEntitiesByFromDate = (a, b) => a.fromDate - b.fromDate;

export const sortEntitiesByEndDate = (a, b) => a.endDate - b.endDate;

export const filterSortedByRange = (min, max, arr) => {
  let firstIndex = arr.findIndex(e => e.fromDate >= min);
  let lastIndex = arr.findLastIndex(e => e.endDate <= max);
  if (firstIndex < 0 || lastIndex < 0) return [];
  if (firstIndex < 0) firstIndex = 0;
  if (lastIndex < 0) lastIndex = arr.length - 1;
  return arr.slice(firstIndex, lastIndex + 1);
};
