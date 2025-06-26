import { Log } from '../../../MiddlewareLogger';

export const logger = {
  debug: (pkg: string, message: string) => {
    Log({
      stack: "frontend",
      level: "debug",
      package: pkg,
      message
    });
  },
  
  info: (pkg: string, message: string) => {
    Log({
      stack: "frontend",
      level: "info",
      package: pkg,
      message
    });
  },
  
  warn: (pkg: string, message: string) => {
    Log({
      stack: "frontend",
      level: "warn",
      package: pkg,
      message
    });
  },
  
  error: (pkg: string, message: string) => {
    Log({
      stack: "frontend",
      level: "error",
      package: pkg,
      message
    });
  }
}; 