/**
 * Logger Utility
 * 
 * Centralized logging with environment-aware output
 * In production, logs can be sent to monitoring services (Sentry, LogRocket, etc.)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log informational messages (development only)
   */
  info(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`ℹ️  ${message}`, data || '');
    }
    this.sendToMonitoring('info', message, data);
  }

  /**
   * Log warning messages
   */
  warn(message: string, data?: any) {
    if (this.isDevelopment) {
      console.warn(`⚠️  ${message}`, data || '');
    }
    this.sendToMonitoring('warn', message, data);
  }

  /**
   * Log error messages (always logged)
   */
  error(message: string, error?: any) {
    console.error(`❌ ${message}`, error || '');
    this.sendToMonitoring('error', message, error);
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`🐛 ${message}`, data || '');
    }
  }

  /**
   * Send logs to monitoring service (implement as needed)
   */
  private sendToMonitoring(level: LogLevel, message: string, data?: any) {
    // TODO: Integrate with Sentry, LogRocket, or similar service
    // Example:
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureMessage(message, { level, extra: data });
    // }
  }
}

export const logger = new Logger();

// Export for backwards compatibility
export default logger;
