import { take, fork, put, select } from 'redux-saga/effects';
import { v4 as uuid } from 'uuid';
import config from 'constants/config';
import types from 'store/actionTypes';
import { requestAddPeriod, requestEditPeriod } from 'store/actionCreators/periods';
import { requestAddBook, requestEditBook } from 'store/actionCreators/books';
import { requestAddStory, requestEditStory } from 'store/actionCreators/stories';
import { requestAddEvent, requestEditEvent } from 'store/actionCreators/events';
import { requestAddCharacter, requestEditCharacter } from 'store/actionCreators/characters';
import { failureCSV, loadingCSV, successCSV } from 'store/actionCreators/csv';
import { getData } from 'store/selectors/data';
import { parseYear } from 'helpers/time';
import { getYoutubeId, isYoutubeUrl, isAudioFormatSupported, getRandomElem } from 'helpers/util';

const validateName = (x, y, name) => {
  if (!name) return [x, y, 'error.emptyName'];
}

const validateDate = (x, y, date) => {
  const iDate = parseInt(date, 10);
  if (!isNaN(iDate) && iDate !== 0) return true;
  return [x, y, 'error.wrongDate'];
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
  if (!color) return true;
  if (colorRegex.test(color)) return true;
  return [x, y, 'error.wrongColor'];
}

const validatePath = (x, y, path) => {
  const p = parseInt(path, 10);
  if (p === 1 || p === 2 || p === 3) return true;
  return [x, y, 'error.wrongPath'];
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
    validateDate(2, y, row[2]),
  ].filter(e => Array.isArray(e));
};

const validateBook = data => (row, y) => {
  return [
    validateName(0, y, row[0]),
    validateDate(1, y, row[1]),
    validateDate(2, y, row[2]),
    validatePeriodRelation(3, y, row[3], data),
    validateCharacterRelations(4, y, row[4], data),
  ].filter(e => Array.isArray(e));
};

const validateStory = data => (row, y) => {
  return [
    validateName(0, y, row[0]),
    validateDate(1, y, row[1]),
    validateDate(2, y, row[2]),
    validateBookRelation(3, y, row[3], data),
    validateCharacterRelations(9, y, row[9], data),
    validateCharacterRelations(10, y, row[10], data),
  ].filter(e => Array.isArray(e));
};

const validateEvent = data => (row, y) => {
  return [
    validateName(0, y, row[0]),
    validateDate(1, y, row[1]),
    validateStoryRelation(2, y, row[2], data),
    validatePath(3, y, row[3]),
    validateColor(4, y, row[4]),
    validateCharacterRelations(5, y, row[5], data),
    validateCharacterRelations(6, y, row[6], data),
  ].filter(e => Array.isArray(e));
};

const validateCharacter = data => (row, y) => {
  return [
    validateName(0, y, row[0]),
    validateDate(2, y, row[2]),
    validateDate(3, y, row[3]),
    validateGender(5, y, row[5]),
  ].filter(e => Array.isArray(e));
};

const parseDates = (iStart, iEnd) => {
  const start = parseYear(iStart);
  const end = parseYear(iEnd);
  return [
    start,
    end || start,
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

const parseMedia = media => {
  const isYoutube = isYoutubeUrl(media);
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
  const [fromDate, endDate] = parseDates(row[1], row[2]);
  const media = parseMedias(row[8]);

  return {
    fromDate,
    endDate,
    media,
    name: row[0],
    color: row[4] || getRandomElem(config.BALL_COLORS),
    description: row[5],
    majorEvents: row[6],
    links: row[7],
  };
};

const parseBook = data => row => {
  const [fromDate, endDate] = parseDates(row[1], row[2]);
  const media = parseMedias(row[12]);
  const period = parsePeriodRelation(row[3], data);
  const characters = parseCharacterRelations(row[4], data);

  return {
    fromDate,
    endDate,
    media,
    period,
    characters,
    name: row[0],
    age: row[7],
    location: row[8],
    summary: row[9],
    content: row[10],
    links: row[11],
  }
};

const parseStory = data => row => {
  const [fromDate, endDate] = parseDates(row[1], row[2]);
  const media = parseMedias(row[12]);
  const book = parseBookRelation(row[3], data);
  const characters = parseCharacterRelations(row[9], data);
  const secondaryCharacters = parseCharacterRelations(row[10], data);

  return {
    fromDate,
    endDate,
    media,
    book,
    characters,
    secondaryCharacters,
    name: row[0],
    age: row[4],
    summary: row[5],
    plot: row[6],
    references: row[7],
    location: row[8],
    path: 1,
    links: row[11],
  };
};

const parseEvent = data => row => {
  const [fromDate, endDate] = parseDates(row[1]);
  const media = parseMedias(row[13]);
  const story = parseStoryRelation(row[2], data);
  const path = parsePath(row[3]);
  const characters = parseCharacterRelations(row[5], data);
  const secondaryCharacters = parseCharacterRelations(row[6], data);

  return {
    fromDate,
    endDate,
    media,
    story,
    path,
    characters,
    secondaryCharacters,
    name: row[0],
    color: row[4] || getRandomElem(config.BALL_COLORS),
    quotesource: row[7],
    quote: row[8],
    summary: row[9],
    location: row[10],
    references: row[11],
    links: row[12],
  };
}

const parseCharacter = data => row => {
  const [fromDate, endDate] = parseDates(row[2], row[3]);
  const media = parseMedias(row[18]);
  const gender = parseGender(row[5]);
  
  return {
    fromDate,
    endDate,
    media,
    gender,
    name: row[0],
    attribution: row[1],
    area: row[4],
    role: row[6],
    nation: row[7],
    summary: row[11],
    content: row[12],
    biography: row[13],
    appearances: row[14],
    quotesource: row[15],
    quote: row[16],
    links: row[17],
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
      const period = periods[i];
      const dbPeriod = data.periods.find(p => p.name === period.name);
      if (dbPeriod) yield put(requestEditPeriod(dbPeriod.id, { ...dbPeriod, ...period }));
      else yield put(requestAddPeriod(periods[i]));
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
      const book = books[i];
      const dbBook = data.books.find(b => b.name === book.name);
      if (dbBook) yield put(requestEditBook(dbBook.id, { ...dbBook, ...book }));
      else yield put(requestAddBook(books[i]));
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
      const story = stories[i];
      const dbStory = data.stories.find(s => s.name === story.name);
      if (dbStory) yield put(requestEditStory(dbStory.id, { ...dbStory, ...story }));
      else yield put(requestAddStory(stories[i]));
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
      const event = events[i];
      const dbEvent = data.events.find(e => e.name === event.name);
      if (dbEvent) yield put(requestEditEvent(dbEvent.id, { ...dbEvent, ...event }));
      else yield put(requestAddEvent(events[i]));
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
      const character = characters[i];
      const dbCharacter = data.characters.find(c => c.name === character.name);
      if (dbCharacter) yield put(requestEditCharacter(dbCharacter.id, { ...dbCharacter, ...character }));
      else yield put(requestAddCharacter(characters[i]));
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