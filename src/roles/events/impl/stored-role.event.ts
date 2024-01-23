import { Role } from 'src/entities/mongodb/role.entity';

export class StoredRoleEvent {
  constructor(public readonly role: Role) {}
}
