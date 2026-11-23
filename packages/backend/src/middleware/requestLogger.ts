import type { Request, Response, NextFunction } from 'express';

// ANSI color codes for development output
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function getStatusColor(statusCode: number): string {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.cyan;
  return colors.green;
}

// Keep request-controlled fields on one log line, including terminal controls.
function safeLogField(value: string): string {
  return JSON.stringify(value).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = getStatusColor(res.statusCode);

    console.log(
      `${colors.dim}[${timestamp}]${colors.reset} ${colors.cyan}${safeLogField(req.method)}${colors.reset} ${safeLogField(req.originalUrl)} - ${statusColor}${res.statusCode}${colors.reset} - ${duration}ms`
    );
  });

  next();
}
