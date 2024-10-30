import winston from 'winston';
const { format } = winston;
const { combine, timestamp, printf } = format;

/**
 * Reformat time stamp to be year-month-day: hrs:minutes:seconds PM/AM 
 * @param {Date()} timestamp 
 * @returns formatted timestamp
 */
const timestampFormatter = (timestamp) => {
    const date = new Date(timestamp);
    const { year, month, day, hours, minutes, seconds, ampm } = { 
        year: date.getFullYear(), 
        month: date.getMonth() + 1, 
        day: date.getDate(), 
        hours: date.getHours(), 
        minutes: date.getMinutes(), 
        seconds: date.getSeconds(),
        ampm: date.getHours() >= 12 ? 'PM' : 'AM',
    };

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${ampm}`;
}

/**
 * Define custom log format
 * @param {String} level
 * @param {String} message
 * @param {String} serviceName
 * @param {String} functionName
 * @param {Date()} timestamp
 * @returns formatted log
 */
const customFormat = printf(({ level, message, serviceName, functionName, timestamp }) => {
    const formattedDate = timestampFormatter(timestamp);
  
    let color;
    switch (level) {
        case 'info':
            color = '\x1b[0m'; // default color
            break;
        case 'warn':
            color = '\x1b[33m'; // yellow
            break;
        case 'error':
            color = '\x1b[31m'; // red
            break;
        default:
            color = '\x1b[0m'; // default color
    }
    return `${color}[${level.toUpperCase()}, ${serviceName}, ${functionName}, ${formattedDate}] ${message}\x1b[0m`;
});

// Create Winston logger instance
const logger = winston.createLogger({
    format: combine(
        timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

// Define custom logging functions
logger.info = (serviceName, functionName, message) => {
    logger.log({
        level: 'info',
        serviceName,
        functionName,
        message
    });
};

logger.warn = (serviceName, functionName, message) => {
    logger.log({
        level: 'warn',
        serviceName,
        functionName,
        message
    });
};

logger.error = (serviceName, functionName, message) => {
    logger.log({
        level: 'error',
        serviceName,
        functionName,
        message
    });
};

export default logger;
