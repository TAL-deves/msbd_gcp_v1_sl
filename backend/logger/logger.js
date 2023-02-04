const dotenv = require("dotenv");
const { createLogger, transports, format, level } = require("winston");
require("winston-mongodb");
var winston = require('winston');
require('winston-daily-rotate-file');

dotenv.config();


// const logger = createLogger({
//   transports: [
//       new transports.File({
//           filename: './logsData/info.log',
//           level: 'info',
//           format: format.combine(format.timestamp(), format.json())
//       })
//     //   ,
//     //   new transports.MongoDB({
//     //       level: 'info',
//     //       db: process.env.DATABASE_CONNECT,
//     //       options: {
//     //           useUnifiedTopology: true
//     //       },
//     //       collection: 'logData',
//     //       format: format.combine(format.timestamp(), format.json())
//     //   }),
//     //   new transports.MongoDB({
//     //     level: 'error',
//     //     db: process.env.DATABASE_CONNECT,
//     //     options: {
//     //         useUnifiedTopology: true
//     //     },
//     //     collection: 'logData',
//     //     format: format.combine(format.timestamp(), format.json())
//     // })
//   ]
// })

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new winston.transports.DailyRotateFile({
    level: "info",
    filename: 
      `./logsData/%DATE%-info.log`,
    datePattern: "YYYY-MM-DD",
    timestamp: new Date(),
  })],
  exitOnError: false,
});

const SMSlogger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new winston.transports.DailyRotateFile({
    level: "info",
    filename: 
      `./logsData/%DATE%-SMSlogData.log`,
    datePattern: "YYYY-MM-DD",
    timestamp: new Date(),
  })],
  exitOnError: false,
});

const SSLlogger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new winston.transports.DailyRotateFile({
    level: "info",
    filename: 
      `./logsData/%DATE%-SSLlogData.log`,
    datePattern: "YYYY-MM-DD",
    timestamp: new Date(),
  })],
  exitOnError: false,
});


const requestLogger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new winston.transports.DailyRotateFile({
    level: "info",
    filename: 
      `./logsData/%DATE%-requestData.log`,
    datePattern: "YYYY-MM-DD",
    timestamp: new Date(),
  })],
  exitOnError: false,
});

const responseLogger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new winston.transports.DailyRotateFile({
    level: "info",
    filename: 
      `./logsData/%DATE%-responseData.log`,
    datePattern: "YYYY-MM-DD",
    timestamp: new Date(),
  })],
  exitOnError: false,
});

const videoLogger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new winston.transports.DailyRotateFile({
    level: "info",
    filename: 
      `./logsData/%DATE%-videoLogData.log`,
    datePattern: "YYYY-MM-DD",
    timestamp: new Date(),
  })],
  exitOnError: false,
});

const userAuditLogger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new winston.transports.DailyRotateFile({
    level: "info",
    filename: 
      `./logsData/%DATE%-userAuditLogger.log`,
    datePattern: "YYYY-MM-DD",
    timestamp: new Date(),
  })],
  exitOnError: false,
});

const mobileDataLogger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new winston.transports.DailyRotateFile({
    level: "info",
    filename: 
      `./logsData/%DATE%-mobileLogData.log`,
    datePattern: "YYYY-MM-DD",
    timestamp: new Date(),
  })],
  exitOnError: false,
});


module.exports = {
  logger: logger,
  SMSlogger: SMSlogger,
  SSLlogger: SSLlogger,
  requestLogger: requestLogger,
  responseLogger: responseLogger,
  videoLogger: videoLogger,
  userAuditLogger: userAuditLogger,
  mobileDataLogger: mobileDataLogger,
};
