import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  // keep the 4th arg to satisfy Express error middleware signature
  _next: NextFunction
): void => {
  // Log error in development
  if (process.env['NODE_ENV'] === 'development') {
    console.error('Error:', error);
  }

  // Default error response
  const errorResponse: {
    success: boolean;
    message: string;
    timestamp: string;
    path: string;
    method: string;
    stack?: string;
  } = {
    success: false,
    message: error.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    path: _req.path,
    method: _req.method,
  };

  // Add stack trace in development
  if (process.env['NODE_ENV'] === 'development' && typeof error.stack === 'string') {
    errorResponse.stack = error.stack;
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    res.status(400).json({
      ...errorResponse,
      message: 'Validation error',
      details: error.message,
    });
    return;
  }

  if (error.name === 'UnauthorizedError') {
    res.status(401).json({
      ...errorResponse,
      message: 'Unauthorized',
    });
    return;
  }

  // Default 500 error
  res.status(500).json({
    ...errorResponse,
    ...(process.env['NODE_ENV'] === 'development' && typeof error.stack === 'string' && { stack: error.stack }),
  });
  return;
}; 