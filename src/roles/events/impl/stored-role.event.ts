import { Role } from 'src/roles/entities/role.entity';

export class StoredRoleEvent {
  constructor(public readonly role: Role) {}
}
