import { APP_INITIALIZER } from '@angular/core';
import { LoggingService, LoggingServiceConfiguration } from 'ionic-logging-service';
import { environment } from '../environments/environment';

export const loggingServiceProvider = {
  deps: [LoggingService],
  multi: true,
  provide: APP_INITIALIZER,
  useFactory: configureLogging,
};

export function configureLogging(loggingService: LoggingService): () => void {
  return () => loggingService.configure(loggingServiceConfiguration);
}

export const loggingServiceConfiguration: LoggingServiceConfiguration = {
  localStorageAppender: {
    localStorageKey: 'ionic-logging-service',
    maxMessages: 250,
    threshold: 'OFF',
  },
  browserConsoleAppender: {
    threshold: 'ALL',
  },
  logLevels: [
    {
      loggerName: 'root',
      logLevel: 'ALL',
    },
  ],
};
