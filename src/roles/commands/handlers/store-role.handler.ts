import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { StoreRoleCommand } from '../impl/store-role.command';
import { Inject } from '@nestjs/common';
import { RolesRepository } from 'src/repositories/mongodb/roles.repository';
import { Role } from 'src/entities/mongodb/role.entity';
import { StoredRoleEvent } from 'src/roles/events/impl/stored-role.event';

@CommandHandler(StoreRoleCommand)
export class StoreRoleHandler implements ICommandHandler<StoreRoleCommand> {
  constructor(
    @Inject('RolesRepositoryInterface')
    private rolesRepository: RolesRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: StoreRoleCommand): Promise<Role> {
    console.log(11111);
    const { data, currentUser } = command;
    const role = await this.rolesRepository.store(data, currentUser);
    this.eventBus.publish(new StoredRoleEvent(role));

    return role;
  }
}
