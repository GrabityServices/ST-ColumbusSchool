const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/blockedOriginReq.log' }),
  ],
});

module.exports = {
  logUnauthorizedOrigin: function (origin) {
    logger.warn({
      message: 'Blocked CORS request',
      timestamp: new Date().toISOString(),
      blockedOrigin: origin
    });
  }
};
