const config = {
  PATH_SCALING: {
    1: [0.1, 1.9],
    2: [0.11, 1.95],
    3: [0.12, 2],
  },
  // This value points to a year in the middle of the initial range.
  // The year 100001 is 1AD
  // The year 100000 is 1BC
  INITIAL_YEAR: 101000,
  INITIAL_RANGE: 1600,
  MIN_YEAR: 96001,
  MAX_YEAR: 102001,
  MIN_INPUT_YEAR: 80000,
  MAX_INPUT_YEAR: 120000,
  MIN_RANGE: 100,
  MAX_RANGE: 4000,
  EMAIL: 'office@929.org.il',
  API: 'http://localhost:1337',
};

export default config;
