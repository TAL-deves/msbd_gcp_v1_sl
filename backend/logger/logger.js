const dotenv = require('dotenv');
const {
  createLogger,
  transports,
  format
} = require('winston');
require('winston-mongodb');

dotenv.config();

const logger = createLogger({
  transports: [
      new transports.File({
          filename: './logsData/info.log',
          level: 'info',
          format: format.combine(format.timestamp(), format.json())
      })
    //   ,
    //   new transports.MongoDB({
    //       level: 'info',
    //       db: process.env.DATABASE_CONNECT,
    //       options: {
    //           useUnifiedTopology: true
    //       },
    //       collection: 'logData',
    //       format: format.combine(format.timestamp(), format.json())
    //   }),
    //   new transports.MongoDB({
    //     level: 'error',
    //     db: process.env.DATABASE_CONNECT,
    //     options: {
    //         useUnifiedTopology: true
    //     },
    //     collection: 'logData',
    //     format: format.combine(format.timestamp(), format.json())
    // })
  ]
})

const SMSlogger = createLogger({
  transports: [
      new transports.File({
          filename: './logsData/SMSlogData.log',
          level: 'info',
          format: format.combine(format.timestamp(), format.json())
      })
    //   ,
    //   new transports.MongoDB({
    //       level: 'info',
    //       db: process.env.DATABASE_CONNECT,
    //       options: {
    //           useUnifiedTopology: true
    //       },
    //       collection: 'SMSlogData',
    //       format: format.combine(format.timestamp(), format.json())
    //   }),
    //   new transports.MongoDB({
    //     level: 'error',
    //     db: process.env.DATABASE_CONNECT,
    //     options: {
    //         useUnifiedTopology: true
    //     },
    //     collection: 'SMSlogData',
    //     format: format.combine(format.timestamp(), format.json())
    // })
  ]
})

const SSLlogger = createLogger({
  transports: [
      new transports.File({
          filename: './logsData/SSLlogData.log',
          level: 'info',
          format: format.combine(format.timestamp(), format.json())
      })
    //   ,
    //   new transports.MongoDB({
    //       level: 'info',
    //       db: process.env.DATABASE_CONNECT,
    //       options: {
    //           useUnifiedTopology: true
    //       },
    //       collection: 'SSLlogData',
    //       format: format.combine(format.timestamp(), format.json())
    //   }),
    //   new transports.MongoDB({
    //     level: 'error',
    //     db: process.env.DATABASE_CONNECT,
    //     options: {
    //         useUnifiedTopology: true
    //     },
    //     collection: 'SSLlogData',
    //     format: format.combine(format.timestamp(), format.json())
    // })
  ]
})

const requestLogger = createLogger({
  transports: [
      new transports.File({
          filename: './logsData/requestData.log',
          level: 'info',
          format: format.combine(format.timestamp(), format.json())
      })
    //   ,
    //   new transports.MongoDB({
    //       level: 'info',
    //       db: process.env.DATABASE_CONNECT,
    //       options: {
    //           useUnifiedTopology: true
    //       },
    //       collection: 'requestLogData',
    //       format: format.combine(format.timestamp(), format.json())
    //   }),
    //   new transports.MongoDB({
    //     level: 'error',
    //     db: process.env.DATABASE_CONNECT,
    //     options: {
    //         useUnifiedTopology: true
    //     },
    //     collection: 'requestLogData',
    //     format: format.combine(format.timestamp(), format.json())
    // })
  ]
})

const responseLogger = createLogger({
  transports: [
      new transports.File({
          filename: './logsData/responseData.log',
          level: 'info',
          format: format.combine(format.timestamp(), format.json())
      })
    //   ,
    //   new transports.MongoDB({
    //       level: 'info',
    //       db: process.env.DATABASE_CONNECT,
    //       options: {
    //           useUnifiedTopology: true
    //       },
    //       collection: 'responseLogData',
    //       format: format.combine(format.timestamp(), format.json())
    //   }),
    //   new transports.MongoDB({
    //     level: 'error',
    //     db: process.env.DATABASE_CONNECT,
    //     options: {
    //         useUnifiedTopology: true
    //     },
    //     collection: 'responseLogData',
    //     format: format.combine(format.timestamp(), format.json())
    // })
  ]
})

const videoLogger = createLogger({
    transports: [
        new transports.File({
            filename: './logsData/videoLogData.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
  })

  const userAuditLogger = createLogger({
    transports: [
        new transports.File({
            filename: './logsData/userAuditLogger.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        })
    //     ,
    //     new transports.MongoDB({
    //         level: 'info',
    //         db: process.env.DATABASE_CONNECT,
    //         options: {
    //             useUnifiedTopology: true
    //         },
    //         collection: 'userAudtLogger',
    //         format: format.combine(format.timestamp(), format.json())
    //     }),
    //     new transports.MongoDB({
    //       level: 'error',
    //       db: process.env.DATABASE_CONNECT,
    //       options: {
    //           useUnifiedTopology: true
    //       },
    //       collection: 'userAudtLogger',
    //       format: format.combine(format.timestamp(), format.json())
    //   })
    ]
  })

  const mobileDataLogger = createLogger({
    transports: [
        new transports.File({
            filename: './logsData/mobileLogData.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
  })

module.exports = {
  logger: logger,
  SMSlogger: SMSlogger,
  SSLlogger: SSLlogger,
  requestLogger: requestLogger,
  responseLogger: responseLogger,
  videoLogger: videoLogger,
  userAuditLogger: userAuditLogger,
  mobileDataLogger: mobileDataLogger
}