import { SessionDocument } from 'src/entities/mongodb/session.entity';
import { BaseRepositoryInterface } from 'src/interface/repositories/mongodb/base.repository.interface';

export interface SessionsRepositoryInterface
  extends BaseRepositoryInterface<SessionDocument> {}
