import { Request } from 'express';

export type IncomingRequest = Request & {
  user?: {
    email?: string;
  };
  internalUser?: {
    username?: string;
  };
  requestId?: string;
};
