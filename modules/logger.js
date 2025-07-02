import { CONFIG } from './config.js';
const { LOGGING } = CONFIG;

export class Logger {
    constructor() {
        this.logs = [];
        this.enabled = LOGGING.ENABLED;
        this.maxLogs = LOGGING.MAX_LOGS;

        this.levels = ['debug', 'info', 'warn', 'error'];
        this.currentLevel = LOGGING.LEVEL;

        this.levelPriority = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
        };
    }

    debug(message, data = null) {
        if (this.enabled && this._shouldLog('debug')) {
            this._log('DEBUG', message, data);
        }
    }

    info(message, data = null) {
        if (this.enabled && this._shouldLog('info')) {
            this._log('INFO', message, data);
        }
    }

    warn(message, data = null) {
        if (this.enabled && this._shouldLog('warn')) {
            this._log('WARN', message, data);
        }
    }

    error(message, error = null) {
        if (this.enabled && this._shouldLog('error')) {
            const errorData = error instanceof Error
                ? { message: error.message, stack: error.stack }
                : error;
            this._log('ERROR', message, errorData);
        }
    }

    _shouldLog(level) {
        return this.levelPriority[level] >= this.levelPriority[this.currentLevel];
    }

    _log(level, message, data) {
        if (!this.enabled) return;

        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            level,
            message,
            ...(data !== null ? { data } : {})
        };

        this.logs.push(entry);

        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        const formatted = `[${timestamp}] [${level}] ${message}`;
        if (data) {
            console.log(formatted, data);
        } else {
            console.log(formatted);
        }
    }

    getLogs() {
        return this.enabled ? this.logs.slice() : [];
    }

    clearLogs() {
        if (this.enabled) {
            this.logs = [];
        }
    }

    show() {
        if (this.enabled) {
            console.table(this.logs);
        }
    }
}

// Exportă o instanță unică (Singleton pattern)
export const logger = new Logger();

// Expune logger-ul global pentru debugging
window.logs = {
    show: () => logger.show(),
    clear: () => logger.clearLogs(),
    get: () => logger.getLogs(),
};
