import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request in development
  if (process.env['NODE_ENV'] === 'development') {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`;
    
    if (process.env['NODE_ENV'] === 'development') {
      console.log(logMessage);
    }
  });

  next();
}; 