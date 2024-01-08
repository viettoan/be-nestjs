import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RolesRepository } from 'src/roles/repositories/roles.repository';
import { DeleteRoleCommand } from '../impl/delete-role.command';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    @Inject('RolesRepositoryInterface')
    private rolesRepository: RolesRepository,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<boolean> {
    const { _id } = command;

    return await this.rolesRepository.delete(_id);
  }
}
