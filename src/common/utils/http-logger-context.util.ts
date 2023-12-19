import { getRequestContext } from './get-request-context.util';
import { IncomingRequest } from '../types/incoming-request.type';

export class HttpLoggerContext {
  constructor(private request: IncomingRequest) {}

  getHttpInfoObject() {
    const { ip, userAgent, acceptLanguage } = getRequestContext(this.request);
    return {
      method: this.request.method,
      path: this.request.path,
      query: this.request.query,
      ip,
      userAgent,
      acceptLanguage,
      requestId: this.request.requestId,
      username:
        this.request.user?.email || this.request.internalUser?.username || '',
    };
  }
}
