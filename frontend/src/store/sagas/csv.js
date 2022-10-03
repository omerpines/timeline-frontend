import { take, fork, put, select } from 'redux-saga/effects';
import { v4 as uuid } from 'uuid';
import types from 'store/actionTypes';
import { requestAddPeriod } from 'store/actionCreators/periods';
import { requestAddBook } from 'store/actionCreators/books';
import { requestAddStory } from 'store/actionCreators/stories';
import { requestAddEvent } from 'store/actionCreators/events';
import { requestAddCharacter } from 'store/actionCreators/characters';
import { failureCSV, loadingCSV, successCSV } from 'store/actionCreators/csv';
import { getData } from 'store/selectors/data';
import { parseYear } from 'helpers/time';
import { getYoutubeId, isAudioFormatSupported } from 'helpers/util';

const validateName = (x, y, name) => {
  if (!name) return [x, y, 'error.emptyName'];
}

const validateDate = (x, y, date) => {
  const iDate = parseInt(date, 10);
  if (!isNaN(iDate) && iDate > 0) return true;
  return [x, y, 'error.wrongDate'];
}

const validateDateFlag = (x, y, flag) => {
  if (flag === 'AD' || flag === 'BC') return true;
  return [x, y, 'error.wrongDateFlag'];
}

const validatePeriodRelation = (x, y, period, data) => {
  if (!period) return true;
  const { periods } = data;
  const p = periods.find(p => p.name === period);
  if (p) return true;
  return [x, y, 'error.wrongPeriod'];
}

const validateBookRelation = (x, y, book, data) => {
  if (!book) return true;
  const { books } = data;
  const b = books.find(b => b.name === book);
  if (b) return true;
  return [x, y, 'error.wrongBook'];
}

const validateStoryRelation = (x, y, story, data) => {
  if (!story) return true;
  const { stories } = data;
  const s = stories.find(s => s.name === story);
  if (s) return true;
  return [x, y, 'error.wrongStory'];
}

const validateCharacterRelations = (x, y, characterStr, data) => {
  if (!characterStr) return true;
  const chars = characterStr.split(',').map(c => c.trim());
  const { characters } = data;
  const check = chars.every(ch => characters.find(c => c.name === ch));
  if (check) return true;
  return [x, y, 'error.wrongCharacters'];
}

const colorRegex = /^#[0-9a-f]{3,6}$/i;

const validateColor = (x, y, color) => {
  if (colorRegex.test(color)) return true;
  return [x, y, 'error.wrongColor'];
}

const validatePath = (x, y, path) => {
  const p = parseInt(path, 10);
  if (p === 1 || p === 2 || p === 3) return true;
  return [x, y, 'error.wrongPath'];
}

const quoteRegex = /(.*?)\((.*?)\)/;

const validateQuote = (x, y, quote) => {
  if (!quote) return true;
  if (quoteRegex.test(quote)) return true;
  return [x, y, 'error.wrongQuote'];
}

const validateGender = (x, y, gender) => {
    if (!gender) return [x, y, 'error.noGender'];
    if (gender === 'זכר' || gender === 'נקבה') return true;
    return [x, y, 'error.wrongGender'];
}

const validatePeriod = (row, y) => {
  return [
    validateName(0, y, row[0]),
    validateDate(1, y, row[1]),
    validateDateFlag(2, y, row[2]),
    validateDate(3, y, row[3]),
    validateDateFlag(4, y, row[4]),
  ].filter(e => Array.isArray(e));
};

const validateBook = data => (row, y) => {
  return [
    validateName(0, y, row[0]),
    validateDate(1, y, row[1]),
    validateDateFlag(2, y, row[2]),
    validateDate(3, y, row[3]),
    validateDateFlag(4, y, row[4]),
    validatePeriodRelation(5, y, row[5], data),
    validateCharacterRelations(6, y, row[6], data),
  ].filter(e => Array.isArray(e));
};

const validateStory = data => (row, y) => {
  return [
    validateName(0, y, row[0]),
    validateDate(1, y, row[1]),
    validateDateFlag(2, y, row[2]),
    validateDate(3, y, row[3]),
    validateDateFlag(4, y, row[4]),
    validateBookRelation(5, y, row[5], data),
    validateCharacterRelations(12, y, row[12], data),
    validateCharacterRelations(13, y, row[13], data),
  ].filter(e => Array.isArray(e));
};

const validateEvent = data => (row, y) => {
  return [
    validateName(0, y, row[0]),
    validateDate(1, y, row[1]),
    validateDateFlag(2, y, row[2]),
    validateDate(3, y, row[3]),
    validateDateFlag(4, y, row[4]),
    validateStoryRelation(5, y, row[5], data),
    validateColor(6, y, row[6]),
    validatePath(7, y, row[7]),
    validateCharacterRelations(8, y, row[8], data),
  ].filter(e => Array.isArray(e));
};

const validateCharacter = data => (row, y) => {
  return [
    validateName(0, y, row[0]),
    validateDate(1, y, row[1]),
    validateDateFlag(2, y, row[2]),
    validateDate(3, y, row[3]),
    validateDateFlag(4, y, row[4]),
    validateGender(7, y, row[7]),
  ].filter(e => Array.isArray(e));
};

const parseDates = (start, startFlag, end, endFlag) => {
  return [
    parseYear(start, startFlag === 'BC'),
    parseYear(end, endFlag === 'BC'),
  ];
};

const parsePeriodRelation = (period, data) => {
  if (!period) return null;
  const { periods } = data;
  return periods.find(p => p.name === period).id;
};

const parseBookRelation = (book, data) => {
  if (!book) return null;
  const { books } = data;
  return books.find(b => b.name === book).id;
}

const parseStoryRelation = (story, data) => {
  if (!story) return null;
  const { stories } = data;
  return stories.find(s => s.name === story).id;
}

const parseCharacterRelations = (characterStr, data) => {
  if (!characterStr) return [];
  const chars = characterStr.split(',').map(c => c.trim());
  const { characters } = data;
  return chars.map(ch => characters.find(c => c.name === ch)).map(ch => ch.id);
};

const parsePath = p => parseInt(p, 10);

const parseGender = gender => {
  if (gender === 'זכר') return 'male';
  return 'female';
}

const parseQuote = quote => {
  const [q, quoteText, quoteSource] = quote.match(quoteRegex);
  return [quoteText.trim(), quoteSource.trim()];
}

const parseMedia = media => {
  const isYoutube = media.includes('youtu.be') || media.includes('youtube.com');
  const isAudio = isAudioFormatSupported(media);

  if (isYoutube) return {
    id: uuid(),
    type: 'youtube',
    youtubeId: getYoutubeId(media),
    title: '',
    description: '',
  };

  if (isAudio) return {
    id: uuid(),
    type: 'audio',
    url: media,
    title: '',
    description: '',
  };

  return {
    id: uuid(),
    type: 'image',
    url: media,
    title: '',
    description: '',
  };
};

const parseMedias = medias => {
  if (!medias) return [];
  const list = medias.split(',').map(s => s.trim());
  return list.map(parseMedia);
};

const parsePeriod = row => {
  const [fromDate, endDate] = parseDates(row[1], row[2], row[3], row[4]);
  const media = parseMedias(row[11]);

  return {
    fromDate,
    endDate,
    media,
    name: row[0],
    color: row[6] || '#ffffff',
    description: row[7],
    majorEvents: row[8],
    links: row[9],
  };
};

const parseBook = data => row => {
  const [fromDate, endDate] = parseDates(row[1], row[2], row[3], row[4]);
  const media = parseMedias(row[14]);
  const period = parsePeriodRelation(row[5], data);
  const characters = parseCharacterRelations(row[6], data);

  return {
    fromDate,
    endDate,
    media,
    period,
    characters,
    name: row[0],
    age: row[9],
    location: row[10],
    content: row[11],
    links: row[12],
  }
};

const parseStory = data => row => {
  const [fromDate, endDate] = parseDates(row[1], row[2], row[3], row[4]);
  const media = parseMedias(row[14]);
  const book = parseBookRelation(row[5], data);
  const characters = parseCharacterRelations(row[12], data);
  const secondaryCharacters = parseCharacterRelations(row[13], data);

  return {
    fromDate,
    endDate,
    media,
    book,
    characters,
    secondaryCharacters,
    name: row[0],
    age: row[6],
    summary: row[7],
    plot: row[8],
    references: row[9],
    location: row[10],
    path: 1,
  };
};

const parseEvent = data => row => {
  const [fromDate, endDate] = parseDates(row[1], row[2], row[3], row[4]);
  const media = parseMedias(row[14]);
  const story = parseStoryRelation(row[5], data);
  const path = parsePath(row[7]);
  const characters = parseCharacterRelations(row[8], data);

  return {
    fromDate,
    endDate,
    media,
    story,
    path,
    characters,
    secondaryCharacters: [],
    name: row[0],
    color: row[6],
    summary: row[10],
    location: row[11],
    references: row[12],
    links: row[13],
  };
}

const parseCharacter = data => row => {
  const [fromDate, endDate] = parseDates(row[1], row[2], row[3], row[4]);
  const media = parseMedias(row[19]);
  const gender = parseGender(row[7]);
  
  return {
    fromDate,
    endDate,
    media,
    gender,
    name: row[0],
    attribution: row[5],
    area: row[6],
    role: row[8],
    nation: row[9],
    summary: row[12],
    content: row[13],
    biography: row[14],
    appearances: row[15],
    links: row[16],
    characters: [],
  };
}

function* uploadCSV({ csvType, content }) {
  const data = yield select(getData);

  const rows = content.slice(1);
  let errors = [];
  if (csvType === 'period') {
    errors = [].concat(...rows.map(validatePeriod));
    if (errors.length) {
      yield put(failureCSV(errors));
      return;
    }

    yield put(loadingCSV());
    const periods = rows.map(parsePeriod);
    for (let i = 0, l = periods.length; i < l; i += 1) {
      yield put(requestAddPeriod(periods[i]));
    }
    yield put(successCSV());
  } else if (csvType === 'book') {
    errors = [].concat(...rows.map(validateBook(data)));
    if (errors.length) {
      yield put(failureCSV(errors));
      return;
    }

    yield put(loadingCSV());
    const books = rows.map(parseBook(data));
    for (let i = 0, l = books.length; i < l; i += 1) {
      yield put(requestAddBook(books[i]));
    }
    yield put(successCSV());
  } else if (csvType === 'story') {
    errors = [].concat(...rows.map(validateStory(data)));
    if (errors.length) {
      yield put(failureCSV(errors));
      return;
    }

    yield put(loadingCSV());
    const stories = rows.map(parseStory(data));
    for (let i = 0, l = stories.length; i < l; i += 1) {
      yield put(requestAddStory(stories[i]));
    }
    yield put(successCSV());
  } else if (csvType === 'event') {
    errors = [].concat(...rows.map(validateEvent(data)));
    if (errors.length) {
      yield put(failureCSV(errors));
      return;
    }

    yield put(loadingCSV());
    const events = rows.map(parseEvent(data));
    for (let i = 0, l = events.length; i < l; i += 1) {
      yield put(requestAddEvent(events[i]));
    }
    yield put(successCSV());
  } else if (csvType === 'character') {
    errors = [].concat(...rows.map(validateCharacter(data)));
    if (errors.length) {
      yield put(failureCSV(errors));
      return;
    }

    yield put(loadingCSV());
    const characters = rows.map(parseCharacter(data));
    for (let i = 0, l = characters.length; i < l; i += 1) {
      yield put(requestAddCharacter(characters[i]));
    }
    yield put(successCSV());
  }
}

export function* onUploadCSV() {
  while (true) {
    const action = yield take(types.CSV_UPLOAD);
    yield fork(uploadCSV, action);
  }
}