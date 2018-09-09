import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
});

// const logger = new(winston.createLogger)({
// 	transports: [
// 		new(winston.transports.Console)({
// 			json: true,
// 			colorize: true
// 		})
// 	]
// });

export default logger;
