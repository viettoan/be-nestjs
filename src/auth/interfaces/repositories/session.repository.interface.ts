import { SessionDocument } from 'src/auth/entities/session.entity';
import { BaseRepositoryInterface } from 'src/common/Interfaces/repositories/mongodb/base.repository.interface';

export interface SessionsRepositoryInterface
  extends BaseRepositoryInterface<SessionDocument> {}
