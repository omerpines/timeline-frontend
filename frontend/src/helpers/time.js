export const formatYear = (year, t) => {
  if (year > 100000) return t('common.dateAD', { date: year - 100000 });
  return t('common.dateBC', { date: 100001 - year });
};

export const renderYear = iYear => {
  const year = parseInt(iYear, 10);
  if (year > 100000) return year - 100000;
  return 100001 - year;
}

export const parseYear = (iYear, bc) => {
  const year = parseInt(iYear, 10);
  if (bc) return 100001 - year;
  return 100000 + year;
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
