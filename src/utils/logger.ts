/**
 * Logger utility for consistent logging throughout the application
 * 
 * This provides different log levels and formatting for better debugging
 * and production logging capabilities.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  level: LogLevel;
  timestamp?: boolean;
  tags?: Record<string, string>;
}

interface LoggerOptions {
  minLevel?: LogLevel;
  enableTimestamps?: boolean;
  enableTags?: boolean;
  reportingEndpoint?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

class Logger {
  private options: Required<LoggerOptions>;
  private buffer: string[] = [];
  private readonly maxBufferSize = 1000;
  private readonly isBrowser = typeof window !== 'undefined';

  constructor(options: LoggerOptions = {}) {
    this.options = {
      minLevel: options.minLevel || 'info',
      enableTimestamps: options.enableTimestamps !== undefined ? options.enableTimestamps : true,
      enableTags: options.enableTags !== undefined ? options.enableTags : true,
      reportingEndpoint: options.reportingEndpoint || ''
    };
  }

  /**
   * Formats a log message with optional timestamp and tags
   */
  private formatMessage(message: string, options: LogOptions): string {
    const parts: string[] = [];

    // Add timestamp
    if (this.options.enableTimestamps && options.timestamp !== false) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    // Add log level
    parts.push(`[${options.level.toUpperCase()}]`);

    // Add tags
    if (this.options.enableTags && options.tags) {
      const tagString = Object.entries(options.tags)
        .map(([key, value]) => `${key}=${value}`)
        .join(' ');
      if (tagString) {
        parts.push(`[${tagString}]`);
      }
    }

    // Add message
    parts.push(message);

    return parts.join(' ');
  }

  /**
   * Logs a message with the specified level and options
   */
  private log(message: string, options: LogOptions): void {
    // Check if level passes the minimum threshold
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    if (levels[options.level] < levels[this.options.minLevel]) {
      return;
    }
    
    const formattedMessage = this.formatMessage(message, options);
    this.buffer.push(formattedMessage);
    
    // Trim buffer if it exceeds max size
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer = this.buffer.slice(this.buffer.length - this.maxBufferSize);
    }
    
    // Log to console in browser
    if (this.isBrowser) {
      switch (options.level) {
        case 'debug':
          console.debug(formattedMessage);
          break;
        case 'info':
          console.info(formattedMessage);
          break;
        case 'warn':
          console.warn(formattedMessage);
          break;
        case 'error':
          console.error(formattedMessage);
          if (this.options.reportingEndpoint) {
            this.reportError(message, options.tags).catch(err => {
              console.error('Error reporting to endpoint:', err);
            });
          }
          break;
      }
    } else {
      // Handle non-browser environment (e.g. Node.js) if needed
      // Could add server-side logging here
    }
  }

  /**
   * Reports an error to the reporting endpoint
   */
  private async reportError(message: string, tags?: Record<string, string>): Promise<void> {
    try {
      await fetch(this.options.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString(),
          tags
        })
      });
    } catch (error) {
      console.error('Failed to report error:', error);
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, tags?: Record<string, string>): void {
    this.log(message, { level: 'debug', tags });
  }

  /**
   * Info level logging
   */
  info(message: string, tags?: Record<string, string>): void {
    this.log(message, { level: 'info', tags });
  }

  /**
   * Warning level logging
   */
  warn(message: string, tags?: Record<string, string>): void {
    this.log(message, { level: 'warn', tags });
  }

  /**
   * Error level logging
   */
  error(message: string, tags?: Record<string, string>): void {
    this.log(message, { level: 'error', tags });
  }

  /**
   * Gets the current log buffer
   */
  getBuffer(): string[] {
    return [...this.buffer];
  }

  /**
   * Clears the log buffer
   */
  clearBuffer(): void {
    this.buffer = [];
  }

  /**
   * Updates logger options
   */
  setOptions(options: Partial<LoggerOptions>): void {
    this.options = {
      ...this.options,
      ...options
    };
  }
}

// Create a singleton logger instance with safe browser detection
const logger = new Logger();
export default logger;
export { logger }; 
export type { LogLevel, LogOptions, LoggerOptions }; 