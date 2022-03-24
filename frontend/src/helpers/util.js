import { easeInCubic } from 'js-easing-functions';
import { compile } from 'path-to-regexp';
import mergeRanges from 'merge-ranges';
import config from 'constants/config';

export const toRange = (min, max, share) => {
  return (max - min) * share + min;
};

export const fromRange = (min, max, point) => {
  return (point - min) / (max - min);
};

export const inRange = (min, max, value) => {
  if (isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
};

// export const getLocalized = (obj, field, lang) => obj[`${field}_${lang}`] || '';
export const getLocalized = (obj, field) => obj[field];

export const checkLocalized = (obj, field, lang) => (obj[`${field}_${lang}`] ? true : false);

export const easeShare = share => easeInCubic(share, 0, 1, 1);

export const hexToRGBA = (hex, opacity) => {
  const red = parseInt(hex.substring(1, 3), 16);
  const green = parseInt(hex.substring(3, 5), 16);
  const blue = parseInt(hex.substring(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

export const denormalize = (ids, entities) => ids.map(id => entities.find(e => e.id === id));

export const groupEntities = (entities) => {
  const ranges = entities.map(c => [c.fromDate, c.endDate]);
  const groupedRanges = mergeRanges(ranges);

  const groups = groupedRanges.map(([fromDate, endDate]) => ({ fromDate, endDate, data: [] }));
  entities.forEach(e => {
    for (let i = 0, l = groupedRanges.length; i < l; i += 1) {
      const g = groups[i];
      if (e.fromDate < g.fromDate || e.endDate > g.endDate) continue;
      groups[i].data.push(e);
      break;
    }
  });

  return groups;
};

export const compilePath = p => compile(p, { encode: encodeURIComponent });

export const cleanApiObject = o => ({ id: o.id, ...o.attributes });

export const cleanApiObjects = os => os.map(cleanApiObject);

export const prepareApiObject = o => {
  const { id, ...rest } = o;
  return { id, data: rest };
};

export const JSONToFormData = json => {
  const formData = new FormData();
  const entries = Object.entries(json);
  const data = {};
  const files = [];
  entries.forEach(([k, v]) => {
    if (k === 'id') return;
    const isApiImage = Boolean(v && v.hasOwnProperty('data'));
    if (v instanceof File) files.push([k, v]);
    else if (!isApiImage) data[k] = v;
  });

  if (!files.length) return data;

  files.forEach(([k]) => {
    data[k] = null;
  });
  formData.append('data', JSON.stringify(data));
  files.forEach(([k, v]) => {
    formData.append(`files.${k}`, v);
  });
  return formData;
};

export const getFileUrl = file => {
  if (file instanceof File) return URL.createObjectURL(file);
  if (file && file.data && file.data.attributes) return `${config.API}${file.data.attributes.url}`;
  return '';
};

export const relationToId = rel => (rel && rel.data ? rel.data.id : null);

export const cleanStringList = s => s.split(',').map(ss => ss.trim()).filter(ss => !!ss);

export const getYoutubeId = link => {
  const a = link.split('/').pop();
  return a;
};
