const winston = require('winston');
const colorize = require('cli-color');
require('winston-daily-rotate-file');

const COLOR_LABEL = {
  info  : colorize.green,
  error : colorize.red,
  debug : colorize.blackBright,
  warn  : colorize.yellow,
};
const COLOR_TEXT = {
  debug: colorize.blackBright,
};

const CONSOLE_TRANSPORT_OPTIONS = {
  timestamp : () => new Date().toISOString().replace(/\..+$/, ''),
  formatter : (options) => {
    let {timestamp, level, message = '', meta = {}} = options;
    let colorLabel = COLOR_LABEL[level] || (text => text);
    let colorText = COLOR_TEXT[level] || (text => text);
    if (Object.keys(meta).length > 0) message += ` ${JSON.stringify(meta)}`;
    message = message.replace(/(#\w+)/g, (str) => colorize.bold(str));
    return `${colorize.blackBright(timestamp())} ${colorLabel(level.toUpperCase())} ${colorText(message)}`;
  },
};

let transports = [new winston.transports.Console(CONSOLE_TRANSPORT_OPTIONS)];
if (SETTINGS.LOG_FILE) {
  transports.push(new (winston.transports.DailyRotateFile)({
    filename    : SETTINGS.LOG_FILE,
    datePattern : 'yyyy-MM-dd.',
    prepend     : true,
    level       : SETTINGS.LOG_LEVEL,
  }));
}

var logger = new winston.Logger({
  transports,
  level                           : SETTINGS.LOG_LEVEL,
  handleExceptions                : true,
  humanReadableUnhandledException : true,
  exitOnError                     : true,
});

module.exports = logger;
