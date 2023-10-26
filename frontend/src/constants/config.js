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
  INITIAL_RANGE: 100,
  // For each year in the 3d part this amount of years will be shown in timeline
  BOTTOM_RATIO: 12.5,
  MIN_YEAR: 96241,
  // MAX_YEAR: 102519,
  MAX_YEAR: 100050,
  MIN_INPUT_YEAR: 96241,
  MAX_INPUT_YEAR: 99837,
  MIN_RANGE: 100,
  MAX_RANGE: 4000,
  EMAIL: 'noreply@timeline.testing.929.org.il',
  EMAIL_SEND_TO: 'omerpines@gmail.com',
  // Zoom is set in percents
  MIN_DESKTOP_ZOOM: 1,
  MIN_MOBILE_ZOOM: 1,
  MAX_DESKTOP_ZOOM: 200,
  MAX_MOBILE_ZOOM: 100,
  //Breakpoint is screen width in px
  MOBILE_BREAK_POINT: 768,
  // Any string like 'robot@929.org.il' or false to use the email from the form
  EMAIL_SEND_FROM: false,
  // API: 'http://timelineapi.testing.929.org.il',
  API: 'http://127.0.0.1:1337',
  // In percents. Determines the position of the red line
  FOCUS_POINT: 20,
  // In percents. Determines the distance from the red line where a period background starts to fade in/out
  PERIOD_TRANSITION_RANGE: 5,
  // The maximum amount of entity balls in the 3d view area. If there's more than that in the "cluster" area
  // all balls inside are clustered
  CLUSTER_TRESHOLD: 100,
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
    '#D50088',
    '#DD44DD',
    '#FFFF00',
    '#FF7F50',
  ],
  // Only links ending with one of those extensions would be accepted as sounds/images.
  // Any URL that is not youtube video URL, not audio and not image will be ignored
  AUDIO_FORMATS: [
    '.ogg', 
    '.mp3',
  ], 
  IMG_FORMATS: [
    '.gif',
    '.jpg',
    '.jpeg',
    '.png',
  ],
  // Height of 2d part in px
  TIMELINE_HEIGHT: 293,
  // Minimal distance between a hover popup and window's edges before the popup sticks, in px
  GROUP_HOVER_PADDING: 20,
};

export default config;
