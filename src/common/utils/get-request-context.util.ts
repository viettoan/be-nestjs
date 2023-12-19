import { Request } from 'express';
import * as requestIp from 'request-ip';

export const getRequestContext = (req: Request) => {
  let ip = null;
  let userAgent = null;
  let acceptLanguage = null;
  if (req) {
    ip = requestIp.getClientIp(req) || null;
    if (!ip) {
      const getIP =
        (
          ((req.headers &&
            (req.headers['X-Forwarded-For'] ||
              req.headers['x-forwarded-for'] ||
              '')) ||
            '') as string
        ).split(',')[0] ||
        (req.socket && req.socket?.remoteAddress) ||
        null;
      ip = getIP
        ? (getIP.length <= 15 && getIP) || getIP.slice(7) || req.ip || null
        : null;
    }
    userAgent =
      req.headers && req.headers['user-agent']
        ? req.headers['user-agent']
        : null;
    acceptLanguage =
      req.headers && req.headers['accept-language']
        ? req.headers['accept-language']
        : null;
  }
  return { ip, userAgent, acceptLanguage };
};
