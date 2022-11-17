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
          filename: 'info.log',
          level: 'info',
          format: format.combine(format.timestamp(), format.json())
      }),
      new transports.MongoDB({
          level: 'info',
          db: process.env.DATABASE_CONNECT,
          options: {
              useUnifiedTopology: true
          },
          collection: 'logData',
          format: format.combine(format.timestamp(), format.json())
      }),
      new transports.MongoDB({
        level: 'error',
        db: process.env.DATABASE_CONNECT,
        options: {
            useUnifiedTopology: true
        },
        collection: 'logData',
        format: format.combine(format.timestamp(), format.json())
    })
  ]
})

const SMSlogger = createLogger({
  transports: [
      new transports.File({
          filename: 'SMSlogData.log',
          level: 'info',
          format: format.combine(format.timestamp(), format.json())
      }),
      new transports.MongoDB({
          level: 'info',
          db: process.env.DATABASE_CONNECT,
          options: {
              useUnifiedTopology: true
          },
          collection: 'SMSlogData',
          format: format.combine(format.timestamp(), format.json())
      }),
      new transports.MongoDB({
        level: 'error',
        db: process.env.DATABASE_CONNECT,
        options: {
            useUnifiedTopology: true
        },
        collection: 'SMSlogData',
        format: format.combine(format.timestamp(), format.json())
    })
  ]
})

const SSLlogger = createLogger({
  transports: [
      new transports.File({
          filename: 'SSLlogData.log',
          level: 'info',
          format: format.combine(format.timestamp(), format.json())
      }),
      new transports.MongoDB({
          level: 'info',
          db: process.env.DATABASE_CONNECT,
          options: {
              useUnifiedTopology: true
          },
          collection: 'SSLlogData',
          format: format.combine(format.timestamp(), format.json())
      }),
      new transports.MongoDB({
        level: 'error',
        db: process.env.DATABASE_CONNECT,
        options: {
            useUnifiedTopology: true
        },
        collection: 'SSLlogData',
        format: format.combine(format.timestamp(), format.json())
    })
  ]
})

const requestLogger = createLogger({
  transports: [
      new transports.File({
          filename: 'requestData.log',
          level: 'info',
          format: format.combine(format.timestamp(), format.json())
      }),
      new transports.MongoDB({
          level: 'info',
          db: process.env.DATABASE_CONNECT,
          options: {
              useUnifiedTopology: true
          },
          collection: 'requestLogData',
          format: format.combine(format.timestamp(), format.json())
      }),
      new transports.MongoDB({
        level: 'error',
        db: process.env.DATABASE_CONNECT,
        options: {
            useUnifiedTopology: true
        },
        collection: 'requestLogData',
        format: format.combine(format.timestamp(), format.json())
    })
  ]
})

const responseLogger = createLogger({
  transports: [
      new transports.File({
          filename: 'responseData.log',
          level: 'info',
          format: format.combine(format.timestamp(), format.json())
      }),
      new transports.MongoDB({
          level: 'info',
          db: process.env.DATABASE_CONNECT,
          options: {
              useUnifiedTopology: true
          },
          collection: 'responseLogData',
          format: format.combine(format.timestamp(), format.json())
      }),
      new transports.MongoDB({
        level: 'error',
        db: process.env.DATABASE_CONNECT,
        options: {
            useUnifiedTopology: true
        },
        collection: 'responseLogData',
        format: format.combine(format.timestamp(), format.json())
    })
  ]
})

module.exports = {
  logger: logger,
  SMSlogger: SMSlogger,
  SSLlogger: SSLlogger,
  requestLogger: requestLogger,
  responseLogger: responseLogger
}