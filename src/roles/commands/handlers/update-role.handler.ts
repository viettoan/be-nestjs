import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RolesRepository } from 'src/roles/repositories/roles.repository';
import { Role } from 'src/roles/entities/role.entity';
import { UpdateRoleCommand } from '../impl/update-role.command';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @Inject('RolesRepositoryInterface')
    private rolesRepository: RolesRepository,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<Role> {
    const { _id, data, currentUser } = command;

    return await this.rolesRepository.update(_id, data, currentUser);
  }
}
