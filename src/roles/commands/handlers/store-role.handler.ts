import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreRoleCommand } from '../impl/store-role.command';
import { Inject } from '@nestjs/common';
import { RolesRepository } from 'src/roles/repositories/roles.repository';
import { Role } from 'src/roles/entities/role.entity';

@CommandHandler(StoreRoleCommand)
export class StoreRoleHandler implements ICommandHandler<StoreRoleCommand> {
  constructor(
    @Inject('RolesRepositoryInterface')
    private rolesRepository: RolesRepository,
  ) {}

  async execute(command: StoreRoleCommand): Promise<Role> {
    const { data, currentUser } = command;

    return await this.rolesRepository.store(data, currentUser);
  }
}
