import { useSelector } from "react-redux";
import { getData } from "store/selectors/data";
import config from 'constants/config';
import { getYoutubeId, isYoutubeUrl, isAudioFormatSupported, getRandomElem } from 'helpers/util';
import { characters } from "store/reducers";

const parseYear = iYear => {
  const year = parseInt(iYear, 10);
  if (year === 100001) return 0;
  if (year > 100000) return year - 100000;
  return year - 100001;
}

const parseDates = (iStart, iEnd) => {
  const start = parseYear(iStart);
  const end = parseYear(iEnd);
  return [
    start,
    end || start,
  ];
};

const parseMedias = medias => {
  var media = '';
  for(var i=0; i<medias.length; i++) {
    media += medias[i];
    media += ',';
  }

  if(medias.length > 0)
    return media.slice(0, -1);
  return media;
};

const parseGender = gender => {
  if (gender === 'male') return 'זכר';
  return 'נְקֵבָה';
}

const checkPeriod = (period, arrays) => {
  var [fromDate, endDate] = parseDates(period.fromDate, period.endDate);
  for (var i=0; i < arrays.length; i++) {
    if (period.name === arrays[i].name && fromDate === arrays[i].fromDate && endDate === arrays[i].endDate)
      return true
  }

  return false;
}

const checkEvent = (event, arrays) => {
  var [fromDate, endDate] = parseDates(event.fromDate);
  for (var i=0; i < arrays.length; i++) {
    if (event.name === arrays[i].name && fromDate === arrays[i].fromDate)
      return true
  }

  return false;
}

const findPeriodRealtaion = (id, periods) => {
  for(var i=0; i< periods.length; i++) {
    if (periods[i].id === id)
      return periods[i].name;
  }
  return "";
}

const findCharacterRealtation = (chars, characters) => {
  var characterStr = ""
  for(var i=0; i<chars.length; i++) {
    for(var j=0; j<characters.length; j++) {
      if(chars[i] === characters[j].id) {
        characterStr += characters[j].name;
        characterStr += ',';
      }
    }
  }
  if (chars.length > 0)
    return characterStr.slice(0, -1);
  return characterStr;
}

const findBookRelation = (id, books) => {
  for(var i=0; i< books.length; i++) {
    if(books[i].id === id)
      return books[i].name;
  }

  return "";
}

const findStoryRleation = (id, stories) => {
  for(var i=0; i< stories.length; i++) {
    if(stories[i].id === id)
      return stories[i].name;
  }

  return "";
}

const parseShowTimeLine = (state) => {
  if (parseInt(state) === 1)
    return 1;
  else
    return 0;
}

const useGetCSV = (csvType) => {
  var dataArray = [];
  var i = 0;
  var fromDate = ''
  var endDate = ''
  const {periods, characters, stories, events, books} =  useSelector(getData);

  if (csvType === 'period') {
    for(i = 0; i < periods.length; i++) {
      if (checkPeriod(periods[i], dataArray))
        continue;
      var period = {};
      [fromDate, endDate] = parseDates(periods[i].fromDate, periods[i].endDate);
      period.name = periods[i].name;
      period.fromDate = fromDate;
      period.endDate = endDate;
      period.image = periods[i].image.data === null ? "": periods[i].image.data;
      period.color = periods[i].color === undefined ? getRandomElem(config.BALL_COLORS): periods[i].color;
      period.description = periods[i].description === undefined ? "": periods[i].description;
      period.majorEvents = periods[i].majorEvents === undefined ? "": periods[i].majorEvents;
      period.links = periods[i].links === undefined ? "": periods[i].links;
      period.media = periods[i].media === [] ? "": JSON.stringify(periods[i].media);
      dataArray.push(period)
    }
  }

  if (csvType === 'book') {
    for(i = 0; i < books.length; i++) {
      if (checkPeriod(books[i], dataArray))
        continue;
      var book = {};
      [fromDate, endDate] = parseDates(books[i].fromDate, books[i].endDate);
      book.name = books[i].name;
      book.fromDate = fromDate;
      book.endDate = endDate;
      book.period = books[i].period === undefined ? "": findPeriodRealtaion(books[i].period, periods);
      book.characters = books[i].characters === undefined ? "": findCharacterRealtation(books[i].characters, characters);
      book.bookiamge = "";
      book.backimage = "";
      book.age = books[i].age === undefined ? "": books[i].age;
      book.location = books[i].location === undefined ? "": books[i].location;
      book.summary = books[i].summary === undefined? "": books[i].summary;
      book.content = books[i].content === undefined ? []: books[i].content;
      book.links = books[i].links === undefined ? []: books[i].links;
      book.media = books[i].media === undefined ? []: JSON.stringify(books[i]?.media);
      dataArray.push(book)
    }
  }

  if (csvType === 'story') {
    for(i = 0; i < stories.length; i++) {
      if(checkPeriod(stories[i], dataArray))
        continue;
      var story = {};
      [fromDate, endDate] = parseDates(stories[i].fromDate, stories[i].endDate);
      story.name = stories[i].name;
      story.fromDate = fromDate;
      story.endDate = endDate;
      story.book = stories[i].book === undefined ? "": findBookRelation(stories[i].book, books);
      story.age = stories[i].age === undefined ? "": stories[i].age;
      story.summary = stories[i].summary === undefined? "": stories[i].summary;
      story.plot = stories[i].plot === undefined ? "": stories[i].plot;
      story.references = stories[i].references === undefined ? "": stories[i].references;
      story.location = stories[i].location === undefined ? "": stories[i].location;
      story.characters = stories[i].characters === undefined ? "": findCharacterRealtation(stories[i].characters, characters);
      story.secondaryCharacters = stories[i].secondaryCharacters === undefined ? "": findCharacterRealtation(stories[i].secondaryCharacters, characters);
      story.links = stories[i].links === undefined ? []: stories[i].links;
      story.media = stories[i].media === undefined ? []: JSON.stringify(stories[i].media);
      dataArray.push(story)
    }
  }

  if (csvType === 'event') {
    for(i = 0; i < events.length; i++) {
      if(checkEvent(events[i], dataArray))
        continue;
      var event = {};
      [fromDate, endDate] = parseDates(events[i].fromDate);
      event.name = events[i].name;
      event.fromDate = fromDate;
      event.story = events[i].story === undefined ? "": findStoryRleation(events[i].story, stories);
      event.path = events[i].path === undefined ? "": events[i].path;
      event.color = events[i].color === undefined ? getRandomElem(config.BALL_COLORS): events[i].color;
      event.characters = events[i].characters === undefined ? "": findCharacterRealtation(events[i].characters, characters);
      event.secondaryCharacters = events[i].secondaryCharacters === undefined ? "": findCharacterRealtation(events[i].secondaryCharacters, characters);
      event.quotesource = events[i].quotesource === undefined? "": events[i].quotesource;
      event.quote = events[i].quote === undefined ? "": events[i].quote;
      event.summary = events[i].summary === undefined ? "": events[i].summary;
      event.location = events[i].location === undefined ? "": events[i].location;
      event.references = events[i].references === undefined ? "": events[i].references;
      event.links = events[i].links === undefined ? "":  events[i].links;
      event.media = events[i].media === undefined ? []: JSON.stringify(events[i].media);
      dataArray.push(event)
    }
  }

  if (csvType === 'character') {
    for(i = 0; i < characters.length; i++) {
      if(checkPeriod(characters[i], dataArray))
        continue;
      var character = {};
      [fromDate, endDate] = parseDates(characters[i].fromDate);
      character.name = characters[i].name;
      character.attribution = characters[i].attribution === undefined ? "": characters[i].attribution;
      character.fromDate = fromDate;
      character.endDate = endDate;
      character.area = characters[i].area === undefined ? "": characters[i].area;
      character.gender = characters[i].gender === undefined ? "": parseGender(characters[i].gender);
      character.roles = characters[i].role === undefined ? []: characters[i].roles;
      character.nation = characters[i].nation === undefined ? "": characters[i].nation;
      character.shortDescription = characters[i].shortDescription === undefined ? "": characters[i].shortDescription;
      character.image = characters[i].image === undefined ? "": "";
      character.timeline = characters[i].timeline === undefined ? "": characters[i].timeline;
      character.summary = characters[i].summary === undefined ? "": characters[i].summary;
      character.content = characters[i].content === undefined? "": characters[i].content;
      character.biography = characters[i].biography === undefined ? "": characters[i].biography;
      character.appearances = characters[i].appearances === undefined ? "": characters[i].appearances;
      character.quotesource = characters[i].quotesource === undefined ? "": characters[i].quotesource;
      character.quote = characters[i].quote === undefined ? "": characters[i].quote;
      character.links = characters[i].links === undefined ? "": characters[i].links;
      character.media = characters[i].media === undefined ? "": JSON.stringify(characters[i].media);
      character.showTimeLine = characters[i].showTimeLine === undefined ? 0: parseShowTimeLine(characters[i].showTimeLine);
      dataArray.push(character)
    }
  }
  return dataArray;
};

export default useGetCSV;
