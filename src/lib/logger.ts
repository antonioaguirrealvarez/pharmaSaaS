type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  meta?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, module: string, message: string, meta?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      meta
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // In development, also log to console
    if (import.meta.env.DEV) {
      const style = this.getConsoleStyle(level);
      console.log(
        `%c${entry.timestamp} [${module}] ${level.toUpperCase()}: ${message}`,
        style,
        meta || ''
      );
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case 'error':
        return 'color: #ff4444; font-weight: bold';
      case 'warn':
        return 'color: #ffbb33; font-weight: bold';
      case 'info':
        return 'color: #00C851; font-weight: bold';
      case 'debug':
        return 'color: #33b5e5; font-weight: bold';
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const createModuleLogger = (module: string) => ({
  error: (message: string, meta?: any) => 
    Logger.getInstance().log('error', module, message, meta),
  warn: (message: string, meta?: any) => 
    Logger.getInstance().log('warn', module, message, meta),
  info: (message: string, meta?: any) => 
    Logger.getInstance().log('info', module, message, meta),
  debug: (message: string, meta?: any) => 
    Logger.getInstance().log('debug', module, message, meta)
});