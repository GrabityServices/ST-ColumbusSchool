const winston=require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/user-logs.log' }),
  ],
});

module.exports = function logging(req, res, next) {
  const userDetails = req.user ? JSON.stringify(req.user) : "-";
  logger.info(
    `DT: ${Date.now()} - User details: ${userDetails} - Method: ${req.method} - URL: ${req.url} - IP: ${req.ip}`
  );
  next();

};
