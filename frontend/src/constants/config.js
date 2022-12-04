const config = {
  PATH_SCALING: {
    1: [0.1, 1.9],
    2: [0.11, 1.95],
    3: [0.12, 2],
  },
  // This value points to a year in the middle of the initial range.
  // The year 100001 is 1AD
  // The year 100000 is 1BC
  INITIAL_YEAR: 97041,
  INITIAL_RANGE: 1600,
  MIN_YEAR: 96241,
  MAX_YEAR: 125833,
  MIN_INPUT_YEAR: 96241,
  MAX_INPUT_YEAR: 120000,
  MIN_RANGE: 100,
  MAX_RANGE: 4000,
  EMAIL: 'office@929.org.il',
  EMAIL_SEND_TO: 'yasenfire@gmail.com',
  // Any string like 'robot@929.org.il' or false to use the email from the form
  EMAIL_SEND_FROM: false,
  API: 'http://timelineapi.testing.929.org.il',
  // In percents. Determines the position of the red line
  FOCUS_POINT: 20,
  // In percents. Determines the distance from the red line where a period background starts to fade in/out
  PERIOD_TRANSITION_RANGE: 5,
  AUDIO_FORMATS: ['.ogg', '.mp3'],
  // The maximum amount of entity balls in the 3d view area. If there's more than that in the "cluster" area
  // all balls inside are clustered
  CLUSTER_TRESHOLD: 9,
  // In percents from INITIAL_RANGE
  ZOOM_INCREMENT: 10,
  // In percents from INITIAL_RANGE on each mouse wheel event
  MOUSE_ZOOM_INCREMENT: 5,
  MOBILE_DRAG_SLOWDOWN: 10,
  // The palette to choose from randomly when new events/periods are created through CSV and no color is provided
  BALL_COLORS: [
    '#FF0000',
    '#008000',
    '#0000FF',
    '#DE3163',
    '#FFFFFF',
    '#000000',
    '#FFFF00',
    '#FF7F50',
  ],
};

export default config;
