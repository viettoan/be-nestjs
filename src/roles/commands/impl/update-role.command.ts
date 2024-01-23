import { UpdateRoleDto } from 'src/roles/dto/update-role.dto';
import { User } from 'src/entities/mongodb/user.entity';

export class UpdateRoleCommand {
  constructor(
    public _id: string,
    public data: UpdateRoleDto,
    public currentUser?: User,
  ) {}
}
