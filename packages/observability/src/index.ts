export type LogLevel = 'info' | 'warn' | 'error';

export interface LogRecord {
  level: LogLevel;
  service: string;
  message: string;
  at: string;
  context?: Record<string, unknown>;
}

export interface Logger {
  info(message: string, context?: Record<string, unknown>): LogRecord;
  warn(message: string, context?: Record<string, unknown>): LogRecord;
  error(message: string, context?: Record<string, unknown>): LogRecord;
  records(): LogRecord[];
}

export function createLogger(service: string, sink: LogRecord[] = []): Logger {
  function write(level: LogLevel, message: string, context?: Record<string, unknown>): LogRecord {
    const record: LogRecord = { level, service, message, at: new Date().toISOString() };
    if (context) record.context = context;
    sink.push(record);
    if (process.env.NODE_ENV !== 'test') {
      console.log(JSON.stringify(record));
    }
    return record;
  }

  return {
    info: (message, context) => write('info', message, context),
    warn: (message, context) => write('warn', message, context),
    error: (message, context) => write('error', message, context),
    records: () => [...sink],
  };
}

export function captureError(
  logger: Logger,
  error: unknown,
  context?: Record<string, unknown>,
): string {
  const eventId = `local-${Date.now().toString(36)}`;
  const message = error instanceof Error ? error.message : String(error);
  logger.error(message, { eventId, ...context });
  return eventId;
}
