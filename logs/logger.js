const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)),
    transports: [
        new transports.File({
            maxsize: 524000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/log-api.log`
        }),
        new transports.Console({
            level: 'debug',

        }),
        new transports.File({
            maxsize: 524000,
            maxFiles: 5,
            level: 'error',
            filename: `${__dirname}/../logs/error.log`
        })
    ]
});