import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { User } from 'src/entities/mongodb/user.entity';

export class StoreRoleCommand {
  constructor(
    public data: CreateRoleDto,
    public currentUser?: User,
  ) {}
}
