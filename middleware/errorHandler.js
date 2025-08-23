const morgan = require('morgan');
const winston = require('winston');

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Define Morgan format and stream
const format = ':remote-addr :method :url :status :res[content-length] - :response-time ms';
const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

const morganLogger = morgan(format, { stream });

// Define error handler
module.exports = function errorHandler(err, req, res, next) {
  let error = { ...err, message: err.message };
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (error.statusCode >= 500) {
    logger.error('SERVER ERROR', err);
  } else if (error.statusCode >= 400) {
    logger.info('CLIENT ERROR', err);
  }

  res.status(error.statusCode).json({
    success: false,
    status: error.statusCode,
    message: error.message,
  });
};
